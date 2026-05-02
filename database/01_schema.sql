-- BytesDoc Document Management System
-- Database schema based on approved ERD (erd.png)
-- Target: MySQL 8.0+ (also compatible with MariaDB 10.4+)

CREATE DATABASE IF NOT EXISTS `bytesdoc`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `bytesdoc`;

-- ---------------------------------------------------------------------------
-- Reference / lookup tables (must exist before USER and DOCUMENT)
-- ---------------------------------------------------------------------------

CREATE TABLE `role` (
  `role_id`   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `role_name` VARCHAR(50)  NOT NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `uq_role_name` (`role_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `category` (
  `category_id`   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `uq_category_name` (`category_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `event` (
  `event_id`   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `event_name` VARCHAR(150) NOT NULL,
  `event_date` DATE         NULL,
  PRIMARY KEY (`event_id`),
  UNIQUE KEY `uq_event_name` (`event_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `administration` (
  `administration_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `admin_name`        VARCHAR(100) NOT NULL,
  `start_date`        DATE         NULL,
  `end_date`          DATE         NULL,
  PRIMARY KEY (`administration_id`),
  UNIQUE KEY `uq_admin_name` (`admin_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Core entity: USER
-- ---------------------------------------------------------------------------

CREATE TABLE `user` (
  `username_id`  INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `role_id`      INT UNSIGNED NOT NULL,
  `name`         VARCHAR(150) NOT NULL,
  `email`        VARCHAR(255) NOT NULL,
  `password`     VARCHAR(255) NOT NULL,                  -- store bcrypt/argon2 hash, never plaintext
  `created_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`username_id`),
  UNIQUE KEY `uq_user_email` (`email`),
  KEY `fk_user_role_idx` (`role_id`),
  CONSTRAINT `fk_user_role`
    FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Core entity: DOCUMENT
-- ---------------------------------------------------------------------------

CREATE TABLE `document` (
  `document_id`       INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `administration_id` INT UNSIGNED NOT NULL,
  `category_id`       INT UNSIGNED NOT NULL,
  `event_id`          INT UNSIGNED NOT NULL,
  `uploaded_by`       INT UNSIGNED NOT NULL,             -- FK -> user.username_id
  `upload_date`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `title`             VARCHAR(255) NOT NULL,
  `file_path`         VARCHAR(500) NOT NULL,
  `is_archived`       TINYINT(1)   NOT NULL DEFAULT 0,
  `is_locked`         TINYINT(1)   NOT NULL DEFAULT 0,
  PRIMARY KEY (`document_id`),
  KEY `fk_document_administration_idx` (`administration_id`),
  KEY `fk_document_category_idx`       (`category_id`),
  KEY `fk_document_event_idx`          (`event_id`),
  KEY `fk_document_user_idx`           (`uploaded_by`),
  KEY `idx_document_archived`          (`is_archived`),
  CONSTRAINT `fk_document_administration`
    FOREIGN KEY (`administration_id`) REFERENCES `administration` (`administration_id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_document_category`
    FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_document_event`
    FOREIGN KEY (`event_id`) REFERENCES `event` (`event_id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_document_user`
    FOREIGN KEY (`uploaded_by`) REFERENCES `user` (`username_id`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Audit table: ACTIVITY_LOG
--   document_id is nullable because some actions (e.g. "login") have no doc.
-- ---------------------------------------------------------------------------

CREATE TABLE `activity_log` (
  `log_id`      BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`     INT UNSIGNED    NOT NULL,
  `document_id` INT UNSIGNED    NULL,
  `action`      ENUM('upload','download','view','archive','login','edit','delete')
                NOT NULL,
  `timestamp`   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`),
  KEY `fk_log_user_idx`     (`user_id`),
  KEY `fk_log_document_idx` (`document_id`),
  KEY `idx_log_timestamp`   (`timestamp`),
  CONSTRAINT `fk_log_user`
    FOREIGN KEY (`user_id`) REFERENCES `user` (`username_id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_log_document`
    FOREIGN KEY (`document_id`) REFERENCES `document` (`document_id`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
