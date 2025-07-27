// models/city.js

import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const CitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

CitySchema.plugin(mongoosePaginate);

const City = mongoose.model('City', CitySchema);
export default City;
