import { Review } from '@/types/review';
import { MOCK_REVIEWS } from '@/data/mock/reviews';
import { getStoredItem, setStoredItem } from './storage';

const REVIEWS_STORAGE_KEY = 'suburbplus_reviews';

export interface IReviewService {
  getReviewsForTarget(targetId: string): Promise<Review[]>;
  getAllReviews(): Promise<Review[]>;
  addReview(review: Omit<Review, 'id' | 'date' | 'helpfulCount'>): Promise<Review>;
}

class MockReviewService implements IReviewService {
  private getReviews(): Review[] {
    return getStoredItem<Review[]>(REVIEWS_STORAGE_KEY, MOCK_REVIEWS);
  }

  private saveReviews(reviews: Review[]): void {
    setStoredItem(REVIEWS_STORAGE_KEY, reviews);
  }

  async getReviewsForTarget(targetId: string): Promise<Review[]> {
    return this.getReviews().filter(r => r.targetId === targetId);
  }

  async getAllReviews(): Promise<Review[]> {
    return this.getReviews();
  }

  async addReview(params: Omit<Review, 'id' | 'date' | 'helpfulCount'>): Promise<Review> {
    const reviews = this.getReviews();
    const newRev: Review = {
      ...params,
      id: `rev_${Date.now()}`,
      date: new Date().toISOString().substring(0, 10),
      helpfulCount: 0,
    };
    reviews.unshift(newRev);
    this.saveReviews(reviews);
    return newRev;
  }
}

export const reviewService: IReviewService = new MockReviewService();
