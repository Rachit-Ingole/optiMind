import mongoose, { Schema, model, models } from 'mongoose';

const IdeaRepoSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    content: {
      originalIdea: String,
      goal: String,
      variants: [{
        title: String,
        summary: String,
        description: String,
        scores: {
          impact: Number,
          cost: Number,
          feasibility: Number,
        },
        strengths: [String],
        tradeoffs: [String],
      }],
      businessInsights: {
        type: Schema.Types.Mixed,
      },
      analysis: {
        type: Schema.Types.Mixed,
      },
    },
    forkedFrom: {
      type: Schema.Types.ObjectId,
      ref: 'IdeaRepo',
      default: null,
    },
    forks: [{
      type: Schema.Types.ObjectId,
      ref: 'IdeaRepo',
    }],
    stars: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    tags: [String],
    category: {
      type: String,
      default: 'general',
    },
    starCount: {
      type: Number,
      default: 0,
    },
    forkCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
IdeaRepoSchema.index({ owner: 1 });
IdeaRepoSchema.index({ visibility: 1 });
IdeaRepoSchema.index({ starCount: -1 });
IdeaRepoSchema.index({ createdAt: -1 });

export const IdeaRepo = models.IdeaRepo || model('IdeaRepo', IdeaRepoSchema);
