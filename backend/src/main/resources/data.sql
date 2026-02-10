INSERT INTO projects
(title, slug, description, image_url, live_url, github_url, created_at)
VALUES
    (
        'DM Creations',
        'dm-creations',
        'An application to track all your data from one place. I developed the website and the mobile app.',
        'https://res.cloudinary.com/dnqxtaoyo/image/upload/v1770681459/dmcreations_mswn7n.png',
        'https://www.dmcreations.ca',
        NULL,
        CURRENT_TIMESTAMP
    ),
    (
        'Green CTG',
        'green-ctg',
        'An app to help people get an overview of how they can make the city beautiful.',
        'https://images.unsplash.com/photo-1518779578993-ec3579fee39f',
        NULL,
        NULL,
        CURRENT_TIMESTAMP
    ),
    (
        'Green CTG',
        'green-ctg1',
        'An app to help people get an overview of how they can make the city beautiful.',
        'https://images.unsplash.com/photo-1518779578993-ec3579fee39f',
        NULL,
        'https://github.com/...',
        CURRENT_TIMESTAMP
    ),
    (
        'Green CTG',
        'green-ctg2',
        'An app to help people get an overview of how they can make the city beautiful.',
        'https://images.unsplash.com/photo-1518779578993-ec3579fee39f',
        NULL,
        NULL,
        CURRENT_TIMESTAMP
    ),
    (
        'Green CTG',
        'green-ctg3',
        'An app to help people get an overview of how they can make the city beautiful.',
        'https://images.unsplash.com/photo-1518779578993-ec3579fee39f',
        NULL,
        NULL,
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
