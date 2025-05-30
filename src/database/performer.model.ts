import { model, models, Schema } from "mongoose";

const performerSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: false,
    },
    phone: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

performerSchema.virtual("fullName").get(function () {
  return `${this.first_name}${this.last_name ? ` ${this.last_name}` : ""}`;
});

const Performer = models.Performer || model("Performer", performerSchema);
export default Performer;
