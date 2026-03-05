import { model, models, Schema } from "mongoose";

const wishlistSchema = new Schema(
  {
    employer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resume: {
      type: Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
  },
  { timestamps: true }
);

wishlistSchema.index({ employer: 1, resume: 1 }, { unique: true });

const Wishlist = models.Wishlist || model("Wishlist", wishlistSchema);
export default Wishlist;
