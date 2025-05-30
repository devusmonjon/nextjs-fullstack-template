import { model, models, Schema } from "mongoose";
import Region from "./region.model";
import Claimant from "./claimant.model";

const branchSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    region: {
      type: Schema.Types.ObjectId,
      ref: Region,
      required: true,
    },
    claimant: {
      type: Schema.Types.ObjectId,
      ref: Claimant.modelName,
      required: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Branch = models.Branch || model("Branch", branchSchema);
export default Branch;
