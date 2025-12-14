# BookLibrary – Library-to-Home Delivery System -

## Intro--
BookLibrary- is a comprehensive library management and delivery system designed to bridge the gap between physical libraries and readers. It allows users to borrow books online and have them delivered directly to their doorstep, eliminating the need for physical visits.
The platform features a multi-role ecosystem (User, Librarian, Admin) where librarians can manage their catalog, users can track orders, and admins maintain system integrity.

Live Demo: https://library-bookhive.vercel.app/
Server Repository:** [Insert Server Repo Link Here]


## Key Features--
For Users
    - **Browse & Search:** Explore a curated collection of books with advanced search and sorting by price.
    - **Book Details:** View detailed information, ratings, and reviews before borrowing.
    - **Wishlist:** Save favorite books for later.
    - **Order Management:** seamless ordering process with Real-time status tracking (Pending → Shipped → Delivered).
    - **Payment Integration:** Secure "Pay Now" functionality for pending orders.
    - **Profile Management:** Update personal details and profile picture.

For Librarians
    -Catalog Management: Add new books, edit existing details, and manage publication status (Publish/Unpublish).
    -Order Fulfillment: View incoming orders and update statuses (Shipped/Delivered).
    -My Books: A dedicated dashboard to track books added by the specific librarian.

For Admins
    -User Management: Promote users to Librarian or Admin roles.
    -System Oversight: Manage all books across the platform, including the ability to delete or unpublish inappropriate content.
    -Stats Dashboard: Visualize platform data (Total Users, Books, Orders).

## Technologies Used--
Frontend
    -Framework: React.js (Vite)
    -Styling: Tailwind CSS, Shadcn UI
    -State Management: TanStack Query (React Query) for server state & caching
    -Routing: React Router
    -Maps: React Leaflet
    -Animations: Framer Motion
    -Icons: Lucide React

Backend
    -Runtime: Node.js
    -Framework: Express.js
    -Database: MongoDB
    -Authentication: Firebase Auth
    -Payment: Stripe

