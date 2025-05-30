import { model, models, Schema } from "mongoose";

const claimantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mfo: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Claimant = models.Claimant || model("Claimant", claimantSchema);
export default Claimant;
