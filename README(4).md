# RentX

> **Buy. Rent. Need. List.**

RentX is a mobile-first student marketplace designed for college and
hostel communities. It helps students buy, sell, rent, and find things
they need within their campus community.

## Why RentX?

College students often have useful items sitting unused while other
students need the same things temporarily.

RentX connects them in one simple platform.

-   Rent out unused belongings and earn money
-   Buy affordable used products from fellow students
-   Rent items instead of buying them
-   Post a request when you need something
-   Chat directly with the lister
-   Discover listings around your hostel
-   Build trust through verification, ratings, and reporting

## Core Features

### Marketplace

-   Buy products
-   Rent products
-   Sell products
-   List an item for both rent and sale
-   Search listings
-   Category filters
-   Hostel/location filters
-   Price filters
-   Condition filters
-   Availability filters
-   Sort by price, newest, oldest, recommended, and most viewed
-   Favorites

### Campus Locations

RentX supports hostel-based discovery:

-   BH1--BH13
-   Apartments
-   GH1--GH12
-   Other/custom location

For custom locations, users can enter an address.

> Room numbers and unnecessary private location details should not be
> publicly exposed.

### Listing System

A listing includes:

-   Product name
-   Category
-   Location
-   Listing type
-   Rent price per day
-   Selling price
-   Condition
-   1--5 images
-   Availability
-   Listing status

Listing types:

-   `rent`
-   `sell`
-   `both`

Listing statuses:

-   `active`
-   `paused`
-   `reserved`
-   `rented`
-   `sold`
-   `removed`

### Image Optimization

RentX is designed without Firebase Storage for the MVP.

Images are:

1.  Selected on the user's device
2.  Resized client-side
3.  Compressed
4.  Converted to WebP/JPEG
5.  Optimized to approximately 300--600 KB when possible
6.  Stored in Firestore

Because Firestore documents have a size limit, multiple images should be
stored separately under:

``` text
listings/{listingId}/images/{imageId}
```

Never upload unnecessarily large Base64 images.

### Need Something

Students can post what they need.

Example:

``` text
Scientific Calculator
Electronics
BH5
Budget: ₹500
Needed: Tomorrow
```

RentX can show matching marketplace listings when available.

### Direct Chat

Every listing has a prominent:

**Chat with Lister**

button.

Chats are linked to the listing so users know exactly which product they
are discussing.

Chat includes:

-   Real-time messaging
-   Product preview
-   Report user
-   Block user

Users' phone numbers are not automatically shared through RentX chat.

### Authentication

RentX uses:

**Firebase Phone Authentication + OTP**

Google authentication is not used.

Phone verification helps reduce spam and fake accounts, but it is not a
complete fraud-prevention system.

Users see:

**✓ Mobile Verified**

instead of having their full phone number publicly displayed.

### My Listings

Users can manage their own listings:

-   View listings
-   Edit listings
-   Add/remove images
-   Pause listings
-   Resume listings
-   Mark sold
-   Mark rented
-   Delete listings
-   View basic listing statistics

Users must only be able to modify their own listings.

### Reviews

RentX has two separate review systems.

#### Seller Reviews

Users can rate sellers after a completed transaction.

#### Platform Reviews

Users can separately rate their overall RentX experience.

Example:

``` text
How was your RentX experience?

★★★★★

What did you like?
- Easy to use
- Good prices
- Easy chat
- Easy listing
- Renting was useful
```

### Reports & Blocking

Users can report:

-   Listings
-   Users
-   Chats

Report reasons include:

-   Scam
-   Fake product
-   Spam
-   Harassment
-   Wrong information
-   Inappropriate content
-   Other

Users can also block other users.

## Rental Safety

For rental transactions, users should agree on the rental terms before
handing over an item.

The lister may request a **security deposit**, such as money or another
mutually agreed form of security, before handing over the item.

The lister may also verify the renter's valid college/student ID.

**Do not upload or send ID card photos through RentX chat.**

RentX is a marketplace platform and is not responsible for damage, loss,
theft, payment issues, late returns, non-returns, or disputes between
users.

Users should verify the item's condition, price, rental period, security
deposit, and return conditions before completing a rental.

## Listing Disclaimer

Before publishing a rental listing, users must acknowledge:

> **For rentals, take a security deposit (money, ID verification, or
> another mutually agreed security) before handing over the item. RentX
> is not responsible for damage, loss, theft, payment issues, or
> disputes between users.**

The user must tick:

``` text
☐ I agree to the Terms & Conditions and accept the disclaimer.
```

The **Publish** button remains disabled until the user accepts.

## Admin Panel

RentX includes a protected admin dashboard.

### Admin Features

-   Dashboard
-   User management
-   Listing management
-   Need management
-   Reports
-   Announcements
-   Categories
-   Locations
-   Platform reviews
-   Analytics
-   Admin activity logs

Admins can:

-   Warn users
-   Suspend users
-   Ban users
-   Unban users
-   Hide listings
-   Delete listings
-   Restore listings
-   Review reports
-   Moderate platform reviews
-   Publish announcements
-   Manage categories
-   Manage hostel locations

Admin permissions must be enforced securely and never rely only on
frontend checks.

## Technology Stack

### Frontend

-   React
-   JavaScript
-   Tailwind CSS
-   Lucide Icons
-   CSS/JavaScript animations

### Backend / Services

-   Firebase Authentication
-   Cloud Firestore

### Hosting

The project can be deployed using a free hosting provider such as
Netlify or Firebase Hosting.

### Images

-   Client-side image compression
-   Firestore image storage
-   No Firebase Storage for the MVP

## Suggested Firestore Structure

``` text
users/
listings/
needs/
chats/
messages/
reports/
reviews/
announcements/
categories/
locations/
adminLogs/
```

Example listing:

``` text
listings/{listingId}

sellerId
sellerName
productName
category
location
customAddress
listingType
rentPrice
sellPrice
condition
status
createdAt
updatedAt
views
favoritesCount
```

Images:

``` text
listings/{listingId}/images/{imageId}

imageData
order
createdAt
```

## Main User Flow

### Buy

``` text
Login
  ↓
Buy
  ↓
Search / Filter / Sort
  ↓
Product
  ↓
Chat with Lister
  ↓
Transaction
  ↓
Rate Seller
```

### Rent

``` text
Login
  ↓
Rent
  ↓
Search / Filter / Sort
  ↓
Product
  ↓
Chat with Lister
  ↓
Agree on rental terms/security
  ↓
Rental
  ↓
Return
  ↓
Rate Seller
```

### Sell / Rent Out

``` text
Login
  ↓
List
  ↓
Product Details
  ↓
Category
  ↓
Location
  ↓
Rent / Sell / Both
  ↓
Pricing
  ↓
Images
  ↓
Preview
  ↓
Accept Terms
  ↓
Publish
```

### Need

``` text
Need
  ↓
Post Requirement
  ↓
Matching Listings
  ↓
Chat
  ↓
Complete
```

## Project Goals

RentX aims to make campus commerce:

-   Simple
-   Affordable
-   Local
-   Fast
-   Student-friendly
-   More trustworthy

The core product loop is:

**BUY → RENT → NEED → LIST → CHAT**

## Security Principles

-   Phone OTP authentication
-   Firestore Security Rules
-   Users can modify only their own content
-   Admin authorization must be server-side/securely enforced
-   Do not expose users' full phone numbers
-   Do not store student ID card images
-   Validate listing data
-   Report and moderation system
-   Avoid trusting frontend-only permissions

## UI/UX

RentX follows a mobile-first design:

-   Liquid glass
-   Subtle claymorphism
-   Rounded cards
-   Soft shadows
-   Minimal interface
-   Light/dark mode
-   Smooth interactions
-   Responsive layouts
-   Touch-friendly controls
-   Bottom navigation on mobile

Mobile navigation:

``` text
Home | Explore | + List | Chat | Profile
```

Main marketplace navigation:

``` text
BUY | RENT | NEED | LIST
```

## Future Possibilities

Potential future features include:

-   Multiple campus support
-   Verified campus communities
-   Transaction history
-   Seller badges
-   Better recommendation system
-   Rental reminders
-   Saved searches
-   Push notifications
-   QR-based transaction confirmation
-   Campus-specific announcements
-   Advanced moderation
-   Reputation system

## Contribution

For development:

1.  Fork the repository
2.  Create a feature branch
3.  Make your changes
4.  Test on mobile and desktop
5.  Commit your changes
6.  Push the branch
7.  Open a pull request

Example:

``` bash
git checkout -b feature-name
git add .
git commit -m "Add feature"
git push origin feature-name
```

## License

Choose an appropriate license before making the project public.

------------------------------------------------------------------------

**RentX**

**Buy. Rent. Need. List.**
