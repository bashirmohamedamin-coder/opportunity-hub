 Opportunity Hub

PROJECT: OpportunityHub – Youth Opportunities Platform

the livelink:https://github.com/bashirmohamedamin-coder/opportunity-hub.git

1. Project Overview

Build a modern, professional, responsive web application called OpportunityHub.

OpportunityHub is a digital platform designed to help young people discover career-building opportunities, develop professional skills, and connect with organizations offering opportunities.

The platform should bring together students, graduates, young professionals, NGOs, companies, universities, and training institutions.

The main goal is to reduce unemployment challenges, improve access to opportunities, promote equal opportunities, and encourage partnerships between young people and organizations.

The platform should initially focus on Kenya and East Africa, but its architecture should support expansion to other regions.

2. Sustainable Development Goals (SDGs)

The platform should support the following United Nations Sustainable Development Goals:

SDG 8: Decent Work and Economic Growth – Promote employment, internships, entrepreneurship, and career development.

SDG 10: Reduced Inequalities – Make opportunities accessible to young people from different social and economic backgrounds.

SDG 17: Partnerships for the Goals – Connect young people, educational institutions, NGOs, businesses, and other organizations.

Create a dedicated section on the website explaining how OpportunityHub contributes to these SDGs.

3. Website Design and Branding

Create a visually attractive, modern, clean, and professional interface.

Brand name: OpportunityHub

Tagline: "Discover Opportunities. Build Your Future."

Design requirements:

Use navy blue as the primary brand colour.

Use teal or emerald green as the secondary colour.

Use white and light grey backgrounds.

Use modern typography such as Inter or Poppins.

Use professional icons and attractive illustrations.

Include attractive opportunity cards.

Use subtle shadows, rounded corners, and smooth hover effects.

Make the website fully responsive on desktop, tablet, and mobile.

Provide consistent navigation and spacing throughout the application.

Avoid an outdated design or overly crowded layouts.

4. Main Website Pages

A. Home Page

Create an attractive landing page containing:

OpportunityHub logo and navigation bar.

Hero section with the headline: "Your Future Starts With the Right Opportunity."

Supporting text explaining the purpose of the platform.

A prominent search bar for finding opportunities.

Two CTA buttons: "Explore Opportunities" and "Join OpportunityHub".

Featured opportunities section.

Opportunity categories section.

How It Works section.

Statistics showing registered users, listed opportunities, partner organizations, and successful connections. Use clearly identified demo figures until real data is available.

Featured partner organizations.

SDG impact section.

Testimonials using clearly labelled sample content.

Professional footer with navigation links and social media links.

B. Opportunities Page

Create a searchable and filterable opportunity directory.

Include four main categories:

Internships

Volunteer Opportunities

Scholarships

Training Programs

Each opportunity card should display:

Opportunity title.

Organization name.

Organization logo or placeholder.

Opportunity category.

Location.

Application deadline.

Employment or participation type.

Short description.

View Details button.

Add search and filters for:

Opportunity category.

Location or county.

Application deadline.

Organization.

Remote, hybrid, or on-site opportunities.

Include sorting options such as newest opportunities and closing soon.

C. Opportunity Details Page

When a user selects an opportunity, show:

Full opportunity title.

Organization information.

Detailed description.

Eligibility requirements.

Qualifications and skills required.

Benefits.

Location.

Application deadline.

Application instructions.

External application link, where provided.

Save Opportunity button.

Apply Now button.

Do not invent real opportunities or falsely claim that an application has been submitted.

D. User Registration and Login

Create a secure authentication system.

Users should be able to:

Register using their full name, email, and password.

Log in and log out.

Reset forgotten passwords.

Select their account type.

Account types:

Student or Graduate.

Young Professional.

Organization or Employer.

Allow users to complete their profiles after registration.

E. User Dashboard

Create a personalized dashboard for registered users.

Include:

Welcome message.

Profile completion indicator.

Recommended opportunities.

Saved opportunities.

Recent applications.

Upcoming application deadlines.

Profile editing functionality.

Users should be able to save opportunities and track applications.

F. Organization Dashboard

Create a separate dashboard for organizations.

Organizations should be able to:

Create organization profiles.

Add their organization name and description.

Upload their logo.

Post new opportunities.

Edit existing listings.

Delete their own listings.

View applications and interested candidates.

Add an organization verification status to improve trust.

G. About Us Page

Include:

Project background.

Mission statement.

Vision statement.

Main objectives.

Target beneficiaries.

Explanation of the three SDGs.

How the platform creates community impact.

Mission: To make career development and professional opportunities more accessible to young people.

Vision: A connected generation where every young person has equal access to opportunities to learn, grow, and succeed.

H. Contact Page

Include:

Contact form.

Name field.

Email field.

Subject field.

Message field.

Contact information.

Social media links.

Validate all form inputs and show a confirmation message after successful submission.

5. Additional Features

Implement these features:

Search opportunities by keywords.

Filter opportunities by category and location.

Save and bookmark opportunities.

Application tracking.

User profile management.

Organization profile management.

Opportunity posting.

Notifications for approaching deadlines.

Mobile-friendly navigation.

Empty states when there are no opportunities.

Loading indicators and clear error messages.

6. Database and Backend

Use Supabase for the backend.

Implement:

Supabase Authentication.

PostgreSQL database.

Supabase Storage for organization logos and profile images.

Create the following database tables:

profiles

organizations

opportunities

applications

saved_opportunities

notifications

Establish appropriate relationships between the tables.

Security requirements:

Enable Row Level Security (RLS).

Users can edit only their own profiles.

Organizations can manage only their own listings.

Users can view publicly published opportunities.

Users can view and manage only their own applications and saved opportunities.

Protect organization-only features with role-based permissions.

Never expose secret API keys in frontend code.

7. Technical Requirements

Use:

React.

TypeScript.

Tailwind CSS.

Modern reusable UI components.

Supabase for authentication and database functionality.

Lucide icons.

Write clean, organized, reusable, and maintainable code.

Ensure navigation works correctly using appropriate routing.

All buttons, links, forms, search functions, and filters should perform their intended actions.

Do not create buttons that are only decorative.

8. Sample Data

Populate the platform with clearly labelled demonstration opportunities in Kenya.

Include examples from these categories:

Software Engineering Internships.

Community Development Volunteer Programs.

University Scholarships.

Digital Skills Training Programs.

Entrepreneurship Development Programs.

Clearly distinguish demonstration listings from verified, real opportunities.

9. Final Quality Requirements

Before completing the project:

Test all website navigation.

Test user registration and login.

Test opportunity searching and filtering.

Test saving opportunities.

Test application tracking.

Test organization opportunity management.

Ensure responsive layouts work on mobile and desktop.

Fix broken links and non-functional buttons.

Ensure database permissions are properly configured.

Add useful loading, success, and error messages.

10. Final Expected Result

Deliver a complete, modern, professional, functional youth opportunities platform called OpportunityHub.

The website should look like a real-world career and opportunity discovery platform, not a basic student demonstration website.

Prioritize usability, accessibility, professional presentation, secure authentication, and meaningful social impact.

Build the application with a polished homepage first, then implement all remaining pages and functionalities.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/16b51397-c01d-5253-9dba-4a7e67b9f1b0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
