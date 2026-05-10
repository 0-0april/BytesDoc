import { Router } from 'express'
import { supabase } from '../config/supabase'
import { requireAuth, requireRole, AuthedRequest } from '../middleware/auth'
import { Role } from '../types'

const router = Router()

interface ProfileRow {
  id: string
  email: string
  name: string
  role: { role_name: Role }
  created_at: string
}

function toUser(p: ProfileRow) {
  return {
    id: p.id,
    email: p.email,
    fullName: p.name,
    role: p.role.role_name,
    createdAt: p.created_at,
  }
}

// GET /api/users — list all users (chief_minister only)
router.get('/', requireAuth, requireRole('chief_minister'), async (_req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, role:roles(role_name), created_at')
      .order('created_at', { ascending: true })
      .returns<ProfileRow[]>()

    if (error) return res.status(500).json({ error: error.message })
    res.json(data.map(toUser))
  } catch (err) {
    next(err)
  }
})

// POST /api/users — invite/create a new user profile row (chief_minister only)
// Assumes the Supabase auth user already exists (created via Supabase dashboard or
// a separate invite flow). This just upserts the public.users profile row.
router.post('/', requireAuth, requireRole('chief_minister'), async (req, res, next) => {
  try {
    const { id, email, name, role } = req.body ?? {}
    if (!id || !email || !name || !role) {
      return res.status(400).json({ error: 'id, email, name, role are required' })
    }

    const VALID_ROLES: Role[] = ['chief_minister', 'secretary', 'finance_minister', 'member']
    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ error: `role must be one of ${VALID_ROLES.join(', ')}` })
    }

    // Resolve role_id
    const { data: roleRow, error: roleErr } = await supabase
      .from('roles')
      .select('id')
      .eq('role_name', role)
      .single<{ id: number }>()

    if (roleErr || !roleRow) {
      return res.status(500).json({ error: 'could not resolve role' })
    }

    const { data, error } = await supabase
      .from('users')
      .insert({ id, email, name, role_id: roleRow.id })
      .select('id, email, name, role:roles(role_name), created_at')
      .single<ProfileRow>()

    if (error) {
      if (error.code === '23505') return res.status(409).json({ error: 'user already exists' })
      return res.status(500).json({ error: error.message })
    }

    res.status(201).json(toUser(data))
  } catch (err) {
    next(err)
  }
})

// PUT /api/users/:id/role — change a user's role (chief_minister only)
router.put('/:id/role', requireAuth, requireRole('chief_minister'), async (req: AuthedRequest, res, next) => {
  try {
    const { role } = req.body ?? {}
    const VALID_ROLES: Role[] = ['chief_minister', 'secretary', 'finance_minister', 'member']
    if (!role || !VALID_ROLES.includes(role)) {
      return res.status(400).json({ error: `role must be one of ${VALID_ROLES.join(', ')}` })
    }

    // Prevent self-demotion
    if (req.params.id === req.user!.id && role !== 'chief_minister') {
      return res.status(400).json({ error: 'cannot change your own role' })
    }

    const { data: roleRow, error: roleErr } = await supabase
      .from('roles')
      .select('id')
      .eq('role_name', role)
      .single<{ id: number }>()

    if (roleErr || !roleRow) {
      return res.status(500).json({ error: 'could not resolve role' })
    }

    const { data, error } = await supabase
      .from('users')
      .update({ role_id: roleRow.id })
      .eq('id', req.params.id)
      .select('id, email, name, role:roles(role_name), created_at')
      .single<ProfileRow>()

    if (error || !data) {
      return res.status(404).json({ error: 'user not found' })
    }

    res.json(toUser(data))
  } catch (err) {
    next(err)
  }
})

export default router