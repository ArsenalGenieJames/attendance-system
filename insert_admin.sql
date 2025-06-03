-- Insert an admin user
INSERT INTO public.admins (
    name,
    email,
    password,
    role
) VALUES (
    'Admin User',
    'admin@example.com',
    'admin123',  -- Note: In production, use a properly hashed password
    'admin'
);

-- You can verify the insertion with:
SELECT * FROM public.admins WHERE email = 'admin@example.com'; 