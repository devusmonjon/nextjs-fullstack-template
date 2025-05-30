import { model, models, Schema } from "mongoose";

const caseTypeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const CaseType = models.CaseType || model("CaseType", caseTypeSchema);
export default CaseType;
