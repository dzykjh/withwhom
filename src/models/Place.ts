import mongoose, { Schema, models, model } from 'mongoose';

const PlaceSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // 핫플레이스/팝업스토어/식당
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  address: { type: String },
  summary: { type: String },
  description: { type: String },
  minGroupSize: { type: Number },
  maxGroupSize: { type: Number },
  startDate: { type: String }, // 팝업스토어만
  endDate: { type: String },   // 팝업스토어만
  images: { type: [String], default: [], validate: [(arr: string[]) => arr.length <= 4, '최대 4장까지 업로드 가능합니다.'] },
  companions: { type: [String], default: [] }, // 누구와 함께 가는지
}, { timestamps: true });

const Place = models.Place || model('Place', PlaceSchema);

export default Place; 