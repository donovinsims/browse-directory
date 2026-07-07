import type { BlogPost } from '../lib/types'

/**
 * Demo blog content. Titles, dates, and section structure mirror the original
 * template's demo posts; body copy is fresh placeholder writing — replace it
 * with your own articles when real content lands.
 */
export const posts: BlogPost[] = [
  {
    slug: 'productize-your-design-skills',
    title: 'Productize Your Design Skills',
    date: 'Sep 7, 2023',
    excerpt:
      'Client work is only one way to earn from design. Turning your skills into products — assets, courses, and services with fixed scope — builds income that compounds.',
    cover: '/blog/productize-your-design-skills.jpg',
    blocks: [
      {
        type: 'p',
        text: 'Client work trades hours for invoices. Products break that link: you make something once and it earns while you sleep. For designers, the raw material is already on your hard drive — systems, components, and know-how that other people would happily pay for.',
      },
      { type: 'h2', text: 'Sell Digital Assets' },
      {
        type: 'p',
        text: 'UI kits, icon sets, templates, and fonts are the classic starting point. The best sellers are narrow and opinionated: a booking-flow kit for clinics beats a generic "dashboard bundle" because the buyer can see exactly which afternoon of work it saves them.',
      },
      {
        type: 'p',
        text: 'Price for the time saved, not the pixels shipped. A $49 asset that removes a week of fiddling is cheap — and marketplaces reward products with reviews that say exactly that.',
      },
      { type: 'h2', text: 'Online Courses and Workshops' },
      {
        type: 'p',
        text: 'If you have ever explained the same concept to three different juniors, you have a curriculum. Record the explanation once, structure it into short lessons, and let the course carry the repetition for you.',
      },
      {
        type: 'p',
        text: 'Live workshops are the premium tier: same material, higher price, and a feedback loop that quietly improves the recorded version each time you run one.',
      },
      { type: 'h2', text: 'Affiliate Marketing' },
      {
        type: 'p',
        text: 'You already recommend tools every week. Affiliate programs simply attach revenue to advice you were giving away. The rule that keeps it honest: only link to things you would recommend without the commission.',
      },
      { type: 'h2', text: 'Printed Merchandise' },
      {
        type: 'p',
        text: 'Print-on-demand removes the inventory risk that used to make merch a gamble. Posters, prints, and apparel built from your existing visual work can become a storefront in a weekend — the margin is thin, but the marketing value of people wearing your work is not.',
      },
      { type: 'h2', text: 'Consultation Services' },
      {
        type: 'p',
        text: 'Consulting is productized the moment you give it a fixed scope and a fixed price. "Design audit: five pages, annotated video, one call, $750" sells itself in a way "hourly consulting" never will, because the buyer knows exactly what arrives and when.',
      },
      { type: 'h2', text: 'Conclusion' },
      {
        type: 'p',
        text: 'Pick one product, ship it small, and iterate in public. The first version will feel thin — every good product starts that way. What matters is owning something that earns independently of your calendar.',
      },
    ],
  },
  {
    slug: 'freelancing-in-digital-design',
    title: 'Freelancing in Digital Design',
    date: 'Sep 25, 2023',
    excerpt:
      'Freelancing promises freedom and delivers responsibility. A clear-eyed look at what gets better, what gets harder, and how to start without burning your savings.',
    cover: '/blog/freelancing-in-digital-design.jpg',
    blocks: [
      {
        type: 'p',
        text: 'Every designer eventually wonders what would happen if the work came to them directly — no agency margin, no meetings about meetings. Freelancing answers that question honestly: some things get dramatically better, and some get dramatically harder.',
      },
      { type: 'h2', text: 'The Upside of Freelancing' },
      {
        type: 'p',
        text: 'You choose the clients, the hours, and the ceiling. Rates that would take a decade of salary reviews arrive the day you can justify them. And the range of work widens fast — a brand sprint in March, a product redesign in May.',
      },
      {
        type: 'p',
        text: 'The compounding asset is your reputation. Every shipped project is portfolio, referral source, and case study at once — value that used to accrue to your employer now accrues to you.',
      },
      { type: 'h2', text: 'The Challenges' },
      {
        type: 'p',
        text: 'You are also the accountant, the salesperson, and the collections department. Income arrives in waves, and the quiet weeks test your nerves more than any deadline ever did.',
      },
      {
        type: 'p',
        text: 'Scope creep is the silent rate cut: three "tiny tweaks" a week can erase your margin. Clear contracts and a calm, boring process for change requests protect the work — and the relationship.',
      },
      { type: 'h2', text: 'Getting Started: Tips for Aspiring Freelancers' },
      {
        type: 'p',
        text: 'Start before you quit: two or three side projects prove demand and seed referrals. Save a three-month cushion. Set your rate by working backwards from the income you need, not from what feels polite.',
      },
      {
        type: 'p',
        text: 'And treat your pipeline like a design system — maintained weekly, never rebuilt in a panic. Outreach done calmly in good months prevents the desperate discounting that happens in bad ones.',
      },
      { type: 'h2', text: 'Conclusion' },
      {
        type: 'p',
        text: 'Freelancing is not an escape from structure; it is the responsibility of building your own. Designers who thrive treat the business itself as a design problem — iterated, versioned, and steadily improved.',
      },
    ],
  },
  {
    slug: 'designing-for-shareability-on-social-media',
    title: 'Designing for Shareability',
    date: 'Sep 18, 2023',
    excerpt:
      'Shares are a design outcome, not luck. What makes people pass work along — and how to build thumbnails, previews, and layouts that travel well.',
    cover: '/blog/designing-for-shareability-on-social-media.jpg',
    blocks: [
      {
        type: 'p',
        text: 'Work does not spread because it is good; it spreads because sharing it makes the sharer look good. That distinction is the whole craft of designing for social — you are designing for the second audience, the one your first audience wants to impress.',
      },
      { type: 'h2', text: 'The Science Behind Virality' },
      {
        type: 'p',
        text: 'People share what triggers strong emotion — awe, amusement, recognition — and what carries social currency. A diagram that makes someone feel smart for reposting it will always outrun a prettier image that says nothing.',
      },
      {
        type: 'p',
        text: 'Speed matters too: feeds allocate attention in fractions of a second, so the idea has to land before the scroll does.',
      },
      { type: 'h2', text: 'Designing for Shareability' },
      {
        type: 'p',
        text: 'Make one point per artifact. Crop tight, push contrast, and let the headline do real work — assume the image is seen at thumb size, in sunlight, at half attention.',
      },
      {
        type: 'p',
        text: 'Design in the platform’s native ratio instead of exporting one graphic everywhere. A layout that breathes at 4:5 dies at 16:9, and audiences can smell a repost from another network.',
      },
      { type: 'h2', text: 'The Role of Thumbnails and Previews' },
      {
        type: 'p',
        text: 'The preview card is the real first impression: og-image, title, and description decide the click before your page loads. Treat that card as a designed surface — test it in a validator the way you would test a build.',
      },
      { type: 'h2', text: 'Conclusion' },
      {
        type: 'p',
        text: 'Shareability is not a coat of paint applied after the fact. It is a constraint you design under from the start: one idea, legible at a glance, shaped for the person who will pass it on.',
      },
    ],
  },
  {
    slug: 'how-digital-platforms-are-powering-a-new-era-of-entrepreneurship',
    title: 'A New Era of Entrepreneurship',
    date: 'Sep 21, 2023',
    excerpt:
      'Platforms removed the gatekeepers between creative people and their audiences. What the creator economy changes for designers — and where its sharp edges are.',
    cover: '/blog/how-digital-platforms-are-powering-a-new-era-of-entrepreneurship.jpg',
    blocks: [
      {
        type: 'p',
        text: 'A generation ago, reaching an audience meant convincing a publisher, a label, or a network to carry you. Today the distance between making something and selling it is a checkout link. That collapse in distance is the quiet engine of a new kind of entrepreneurship.',
      },
      { type: 'h2', text: 'The Rise of the Creator Economy' },
      {
        type: 'p',
        text: 'Writers, illustrators, developers, and teachers now run businesses that would have been impossible without platform rails — payments, hosting, discovery, and community arrive as commodities, so the differentiator is the work itself.',
      },
      { type: 'h2', text: 'Monetization Avenues' },
      {
        type: 'p',
        text: 'The healthy pattern is a portfolio: direct sales for spikes, subscriptions for stability, sponsorship where the audience is the product, and services where expertise commands a premium. One income stream is a hobby; three is a business.',
      },
      { type: 'h2', text: 'Designing in the Creator Economy' },
      {
        type: 'p',
        text: 'Creators are a new client class with new needs — storefronts, course pages, brand systems that flex across platforms. Designers who understand conversion as well as composition are disproportionately valuable here.',
      },
      {
        type: 'p',
        text: 'Many designers skip the client layer entirely and become creators themselves; the tools do not care which side of the transaction you are on.',
      },
      { type: 'h2', text: 'Challenges in the Creator Economy' },
      {
        type: 'p',
        text: 'Platform dependence is the structural risk: an algorithm change can halve a livelihood overnight. The durable move is owning the relationship — an email list, a domain, a direct line to the people who care.',
      },
      { type: 'h2', text: 'Conclusion' },
      {
        type: 'p',
        text: 'The gatekeepers are gone, but the work of building trust is not. Platforms hand you distribution; what you build on top of it — the craft, the consistency, the direct relationships — is still entirely yours.',
      },
    ],
  },
  {
    slug: 'screen-design-in-the-age-of-mobile-and-vr',
    title: 'The Age of Mobile and VR',
    date: 'Aug 28, 2023',
    excerpt:
      'Screens stopped being rectangles you look at and became spaces you inhabit. How mobile, VR, and wearables each rewrite the rules of screen design.',
    cover: '/blog/screen-design-in-the-age-of-mobile-and-vr.jpg',
    blocks: [
      {
        type: 'p',
        text: 'For decades, screen design meant one canvas: a monitor at arm’s length. Then screens moved into pockets, onto wrists, and finally over our eyes — and each move rewrote assumptions designers had treated as laws.',
      },
      { type: 'h2', text: 'Mobile: Touch, Swipe, and Beyond' },
      {
        type: 'p',
        text: 'Touch replaced the cursor’s precision with the thumb’s reach, and good mobile design reorganized itself around that thumb — targets grew, actions sank to the bottom of the screen, and gestures took over navigation.',
      },
      {
        type: 'p',
        text: 'Context matters as much as ergonomics: mobile sessions are short, interrupted, and glanced at. Interfaces that respect that rhythm feel effortless; ones that demand desktop attention feel hostile.',
      },
      { type: 'h2', text: 'VR: A Whole New World' },
      {
        type: 'p',
        text: 'In VR there is no frame — the interface is the environment. Depth, scale, and comfort become design tokens: place things too close and users flinch, move the horizon and they feel ill.',
      },
      {
        type: 'p',
        text: 'The discipline borrows more from architecture and theater than from web design. You are not laying out a page; you are staging a space where attention moves through it.',
      },
      { type: 'h2', text: 'Wearables: Designing on a Dime-size Screen' },
      {
        type: 'p',
        text: 'A watch face gives you seconds of attention on centimeters of glass. Everything compresses to a single glanceable decision — one number, one action, one state. It is the haiku form of interface design.',
      },
      { type: 'h2', text: 'Conclusion' },
      {
        type: 'p',
        text: 'The common thread across every new surface is humility: the device dictates posture, attention, and context, and the design listens. Master that listening and the next screen — whatever shape it takes — will not frighten you.',
      },
    ],
  },
  {
    slug: 'the-evolution-of-digital-design-from-pixels-to-experience',
    title: 'The Evolution of Digital Design',
    date: 'Aug 17, 2023',
    excerpt:
      'From counting pixels in bitmap grids to orchestrating end-to-end experiences — a short history of how digital design kept redefining its own job.',
    cover: '/blog/the-evolution-of-digital-design-from-pixels-to-experience.jpg',
    blocks: [
      {
        type: 'p',
        text: 'Digital design has reinvented its own job description every decade. Each era believed it had found the discipline’s final form; each was a stepping stone to a larger definition of the work.',
      },
      { type: 'h2', text: 'From Bitmap to Vector' },
      {
        type: 'p',
        text: 'Early screen design was pixel accounting — icons drawn dot by dot inside merciless grids. Vector tools broke that ceiling: shapes became math, scaled freely, and let designers think in systems instead of squares.',
      },
      { type: 'h2', text: 'Web Design Era' },
      {
        type: 'p',
        text: 'The web turned design into something people could visit. Layout wrestled with browsers and bandwidth, and designers learned a lesson that still holds: on the web, you design the rules, not the result.',
      },
      { type: 'h2', text: 'Advent of Mobile' },
      {
        type: 'p',
        text: 'Small screens forced a great pruning. Responsive thinking, touch targets, and performance budgets pushed designers from decorating pages toward designing adaptable systems that survive contact with any viewport.',
      },
      { type: 'h2', text: 'Experience Over Everything' },
      {
        type: 'p',
        text: 'Today the artifact is the least of it. Research, service design, motion, and accessibility fold into one question — how does the whole journey feel? The pixel still matters, but only as one instrument in the orchestra.',
      },
      { type: 'h2', text: 'Conclusion' },
      {
        type: 'p',
        text: 'The tools will keep changing and the canvases will keep multiplying. What survives every era is the designer’s actual job: making technology feel like it was built for the person holding it.',
      },
    ],
  },
]

/** Curated display order for the blog index (mirrors the original). */
export const blogOrder = [
  'productize-your-design-skills',
  'freelancing-in-digital-design',
  'designing-for-shareability-on-social-media',
  'how-digital-platforms-are-powering-a-new-era-of-entrepreneurship',
  'screen-design-in-the-age-of-mobile-and-vr',
  'the-evolution-of-digital-design-from-pixels-to-experience',
]
