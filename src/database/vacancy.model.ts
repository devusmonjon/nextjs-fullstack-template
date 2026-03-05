import { model, models, Schema } from "mongoose";

const vacancySchema = new Schema(
  {
    employer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true },
    salary: { type: String },
    description: { type: String, required: true },
    requirements: { type: String },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

const Vacancy = models.Vacancy || model("Vacancy", vacancySchema);
export default Vacancy;
