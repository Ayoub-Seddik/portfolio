INSERT INTO projects
(title, slug, description, image_url, live_url, github_url, created_at)
VALUES
    (
        'DM Creations',
        'dm-creations',
        'An application to track all your data from one place. I developed the website and the mobile app.',
        'https://res.cloudinary.com/dnqxtaoyo/image/upload/v1771359314/Screenshot_2026-02-17_at_3.15.10_PM_daamkb.png',
        'https://www.dmcreations.ca',
        NULL,
        CURRENT_TIMESTAMP
    ),
    (
        'Champlain Pet Clinic',
        'champlain-pet-clinic',
        'Built a full-stack microservices web application for customers and employees to manage pets, appointments, orders, and inventory.
    Contributed as a member of the Product Team',
        'https://res.cloudinary.com/dnqxtaoyo/image/upload/v1771359508/Screenshot_2026-02-17_at_3.18.23_PM_a97t6u.png',
        NULL,
        'https://github.com/cgerard321/champlain_petclinic',
        CURRENT_TIMESTAMP
    ),
    (
        'IOS News App',
        'ios-news-app',
        'An iOS news application that integrates with a third-party REST API to fetch and display real-time headlines. The app securely uses API keys for authenticated requests, delivering up-to-date articles with a clean, responsive user interface and optimized network handling.',
        'https://res.cloudinary.com/dnqxtaoyo/image/upload/v1771359723/11a645a5-2e0f-41f3-97b6-ec85f737ac03.png',
        NULL,
        'https://github.com/Ayoub-Seddik/NewsAPI',
        CURRENT_TIMESTAMP
    );

INSERT INTO experience (company, position, start_year, end_year, is_present, summary, sort_order)
VALUES
    (
        'Rogers Communications',
        'Customer Service Representative',
        2019,
        NULL,
        TRUE,
        'Provide support to customers by resolving billing and account issues, ensuring a respectful and positive service experience.
    Specialized in both legacy and current systems across product lines; became a go-to resource for complex troubleshooting.
    Recognized for high-quality service, adaptability, and consistency over six years in a fast-paced customer-focused environment.',
        1
    ),
    (
        'School External Client Project',
        'DM Creation — Full Stack Web Application (Group Project)',
        2025,
        2026,
        FALSE,
        'Developed a full-stack web application for customers to purchase party decorations and streamline order fulfillment through a custom ordering system.
    Served as Lead Developer: responsible for system architecture, UI/UX design, client presentations, and managing a 5-member team.',
        2
    ),
    (
        'School Project',
        'Champlain Pet Clinic — Full Stack Web Application (Group Project)',
        2025,
        2025,
        FALSE,
        'Built a full-stack microservices web application for customers and employees to manage pets, appointments, orders, and inventory.
    Contributed as a member of the Product Team, rotating roles as Product Owner, Scrum Master, and Software Developer.',
        3
    );

INSERT INTO education (level, school, program, status, completed_year, sort_order)
VALUES
    ('College', 'Champlain College St-Lambert', 'Computer Science', 'IN_PROGRESS', 2026, 1);

INSERT INTO skills (category, name, sort_order)
VALUES
    ('FrontEnd', 'HTML', 1),
    ('FrontEnd', 'CSS', 2),
    ('FrontEnd', 'JavaScript', 3),
    ('FrontEnd', 'React', 4),

    ('BackEnd', 'Node', 1),
    ('BackEnd', 'Express', 2),
    ('BackEnd', 'PHP', 3),

    ('Design', 'Photoshop', 1),
    ('Design', 'After Effects', 2),
    ('Design', 'Figma', 3);

INSERT INTO contact_messages (full_name, contact_email, contact_number, reason, created_at, is_hidden)
VALUES ('Test User', 'test@example.com', '5145551234', 'This is a seeded message for testing (20+ chars).', CURRENT_TIMESTAMP, false);


INSERT INTO testimonials (name, company, relation, message, status, created_at, updated_at)
VALUES
    ('Jane Doe', 'Acme Inc.', 'Manager', 'Seddik is reliable, fast to ship, and communicates clearly. Great teammate to work with!', 'APPROVED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('John Smith', NULL, 'Classmate', 'Very strong leadership in our group project and always helped unblock others when we got stuck.', 'PENDING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
