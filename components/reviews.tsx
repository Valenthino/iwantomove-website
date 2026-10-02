const REVIEWS_ENABLED = false; // [[PLACEHOLDER: real reviews]] — add verified, consented reviews before enabling.
const reviews: { quote: string; name: string }[] = [];
export function Reviews() {
  if (!REVIEWS_ENABLED) return null;
  return (
    <section className="section wrap" aria-labelledby="reviews-heading">
      <h2 id="reviews-heading">From our customers</h2>
      <div className="cards">
        {reviews.map((review) => (
          <figure className="card" key={review.name}>
            <blockquote>{review.quote}</blockquote>
            <figcaption>{review.name}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
