import { Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    author: "John D.",
    rating: 5,
    comment: "Great product, very comfortable!",
  },
  {
    id: 2,
    author: "Sarah M.",
    rating: 4,
    comment: "Good quality, but sizing runs a bit small.",
  },
  {
    id: 3,
    author: "Mike R.",
    rating: 5,
    comment: "Excellent t-shirt, will buy again!",
  },
];

export default function ReviewSection() {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Đánh giá của khách hàng</h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-4">
            <div className="flex items-center mb-2">
              <div className="flex mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < review.rating
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold">{review.author}</span>
            </div>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
