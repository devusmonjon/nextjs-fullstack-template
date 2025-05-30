import { model, models, Schema } from "mongoose";

const regionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Region = models.Region || model("Region", regionSchema);
export default Region;
