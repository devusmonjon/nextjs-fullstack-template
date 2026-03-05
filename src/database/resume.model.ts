import { model, models, Schema } from "mongoose";

const resumeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fullName: { type: String, required: true },
    title: { type: String, required: true },
    location: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    summary: { type: String, required: true },
    skills: [{ type: String }],
    experience: [
      {
        company: { type: String },
        position: { type: String },
        start: { type: String },
        end: { type: String },
        description: { type: String },
      },
    ],
    education: [
      {
        school: { type: String },
        degree: { type: String },
        start: { type: String },
        end: { type: String },
      },
    ],
    resumeUrl: { type: String },
  },
  { timestamps: true }
);

const Resume = models.Resume || model("Resume", resumeSchema);
export default Resume;
