-- Add a unique constraint on (name, state) so the seed can upsert deterministically
   -- and prevent duplicate waterbodies with identical name/state pairs.

   CREATE UNIQUE INDEX "waterbodies_name_state_key" ON "waterbodies"("name", "state");
