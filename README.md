# Quiet Corner v0.1

A calm five-minute activity app for primary students.

## Included
- Student profile selector using the shared `students` table
- Cosy activity room
- Colour by Number
- Word Search
- Sketchbook
- Automatic progress saving
- Continue buttons for unfinished activities
- Gentle five-minute timer
- No scores, streaks or wellbeing tracking

## Setup
1. Run the SQL in `supabase/quiet_corner_progress.sql` in the Supabase SQL editor.
2. Copy `.env.example` to `.env`.
3. Run:
   npm install
   npm run dev
4. Push to GitHub and deploy to Vercel as a Vite project.

## Notes
The app reads students from the existing `students` table. It uses a new
`quiet_corner_progress` table only to remember each student's activity state.
