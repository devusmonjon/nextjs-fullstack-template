import { model, models, Schema } from "mongoose";
import Region from "./region.model";

const districtSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    region: {
      type: Schema.Types.ObjectId,
      ref: Region.modelName,
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const District = models.Region || model("District", districtSchema);
export default District;
