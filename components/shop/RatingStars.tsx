function generateStarSVG(percentage: number) {
    const fillPercentage = percentage * 100;
    return `
      <svg class="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" fill="currentColor" viewBox="0 0 22 20">
        <defs>
          <linearGradient id="customGradient">
            <stop offset="${fillPercentage}%" stop-color="currentColor"/>
            <stop offset="${fillPercentage}%" stop-color="gray"/>
          </linearGradient>
        </defs> 
        <path fill="url(#customGradient)" d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
      </svg>
    `;
}

export default function Stars({ rating }: { rating: number }) {
    const fullStar =
        '<svg class="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" fill="currentColor" viewBox="0 0 22 20"><path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/></svg>';
    const emptyStar =
        '<svg class="w-4 h-4 text-gray-300 me-1 dark:text-gray-500" aria-hidden="true" fill="currentColor" viewBox="0 0 22 20"><path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/></svg>';

    let starHTML = "";
    let nonEmptyStars = 0;
    // Add full stars
    for (let i = 0; i < Math.floor(rating); i++) {
        starHTML += fullStar;
        nonEmptyStars++;
    }
    // Add gradient star
    if (rating - Math.floor(rating) > 0) {
        starHTML += generateStarSVG(rating - Math.floor(rating));
        nonEmptyStars++;
    } 
    // Add empty stars
    for (let i = 0; i < 5 - nonEmptyStars; i++) {
        starHTML += emptyStar;
    }
    return (
        <div
            id="star-rating"
            className="flex items-center"
            dangerouslySetInnerHTML={{ __html: starHTML }}
        ></div>
    );
}
