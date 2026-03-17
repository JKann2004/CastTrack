-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'MODERATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "WaterbodyType" AS ENUM ('LAKE', 'RESERVOIR', 'RIVER');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'ANONYMOUS');

-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('ALGAL_BLOOM', 'FREE_FISHING_DAY', 'TOURNAMENT', 'SEASONAL_CLOSURE', 'ACCESS_RESTRICTION');

-- CreateEnum
CREATE TYPE "ReminderChannel" AS ENUM ('EMAIL');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "display_name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "reset_token" TEXT,
    "reset_expiry" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waterbodies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "WaterbodyType" NOT NULL,
    "state" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "source" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "waterbodies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catch_reports" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "waterbody_id" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "notes" TEXT,
    "visibility" "Visibility" NOT NULL DEFAULT 'PUBLIC',
    "flagged" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "catch_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "waterbody_id" TEXT,
    "region" TEXT,
    "category" "EventCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "source_url" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reminders" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "license_expiration" DATE NOT NULL,
    "remind_days_before" INTEGER NOT NULL,
    "channel" "ReminderChannel" NOT NULL DEFAULT 'EMAIL',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "last_sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reminders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "user_id" TEXT NOT NULL,
    "waterbody_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("user_id","waterbody_id")
);

-- CreateTable
CREATE TABLE "weather_cache" (
    "id" TEXT NOT NULL,
    "waterbody_id" TEXT NOT NULL,
    "forecast_data" JSONB NOT NULL,
    "alerts_data" JSONB,
    "fetched_at" TIMESTAMP(3) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "weather_cache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "waterbodies_state_idx" ON "waterbodies"("state");

-- CreateIndex
CREATE INDEX "waterbodies_name_idx" ON "waterbodies"("name");

-- CreateIndex
CREATE INDEX "catch_reports_waterbody_id_created_at_idx" ON "catch_reports"("waterbody_id", "created_at");

-- CreateIndex
CREATE INDEX "catch_reports_user_id_idx" ON "catch_reports"("user_id");

-- CreateIndex
CREATE INDEX "events_waterbody_id_start_date_idx" ON "events"("waterbody_id", "start_date");

-- CreateIndex
CREATE INDEX "reminders_enabled_license_expiration_idx" ON "reminders"("enabled", "license_expiration");

-- CreateIndex
CREATE UNIQUE INDEX "weather_cache_waterbody_id_key" ON "weather_cache"("waterbody_id");

-- AddForeignKey
ALTER TABLE "catch_reports" ADD CONSTRAINT "catch_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catch_reports" ADD CONSTRAINT "catch_reports_waterbody_id_fkey" FOREIGN KEY ("waterbody_id") REFERENCES "waterbodies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_waterbody_id_fkey" FOREIGN KEY ("waterbody_id") REFERENCES "waterbodies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_waterbody_id_fkey" FOREIGN KEY ("waterbody_id") REFERENCES "waterbodies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weather_cache" ADD CONSTRAINT "weather_cache_waterbody_id_fkey" FOREIGN KEY ("waterbody_id") REFERENCES "waterbodies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
