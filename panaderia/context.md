# PROJECT CONTEXT — PANADERIA

## 1. Project Overview

Build a complete but intentionally simple bakery management web application using Next.js.

This project is part of an Emerging Technologies / DevOps academic practice. The main objective is not to create an excessively complex business system. The application must demonstrate:

- A functional Next.js application.
- Authentication and authorization.
- Integration with an existing MySQL database.
- Persistent data stored in MySQL running in Docker.
- A clean and responsive administrative interface.
- A Dockerfile for the Next.js application.
- Future integration of the Next.js application and MySQL through Docker Compose.

The application is called:

PANADERIA

Do not overengineer the project.

Prefer simple, maintainable and understandable solutions.

---

# 2. IMPORTANT: EXISTING INFRASTRUCTURE

The MySQL database already exists and is currently running successfully in Docker.

Do NOT recreate the database architecture unnecessarily.
Do NOT replace MySQL with PostgreSQL, SQLite, Supabase, Firebase or another database.
Do NOT store application data in local JSON files or browser storage.

The repository is conceptually organized as:

Web+Docker+VolumenesDatos/
│
├── mysql/
│   ├── database/
│   │   └── init.sql
│   └── docker-compose.yml
│
└── panaderia/
    └── Next.js application

The `mysql` directory contains the existing database infrastructure.

The current MySQL Docker container is:

panaderia-mysql

The database is:

panaderia_db

MySQL is exposed on:

localhost:3306

The existing Docker infrastructure already provides persistent MySQL storage through a Docker volume.

The Next.js application must connect to this existing database during local development.

After the application is complete, it will also be containerized.

Do not destroy, reset or remove the existing Docker volume.

---

# 3. EXISTING DATABASE MODEL

The database contains four tables:

- usuarios
- categorias
- productos
- imagenes

The database schema is conceptually equivalent to the following.

## usuarios

Fields:

- id_usuario — primary key, auto increment
- usuario — unique
- contrasena — password value
- rol — enum
- activo — boolean

Allowed roles are ONLY:

ADMINISTRADOR
AYUDANTE

No additional roles must be created.

An initial administrator already exists:

Username:
PRESI

Role:
ADMINISTRADOR

The current development password is:

+12Presi21+

IMPORTANT:

The initial database currently contains this development password directly.

The final application must use password hashing for passwords created or changed through the application.

Use a simple and appropriate password hashing library such as bcrypt/bcryptjs.

Keep the authentication implementation simple because this is an academic project, but never expose passwords to the client.

---

## categorias

Fields:

- id_categoria — primary key
- nombre_categoria — unique
- descripcion

Relationship:

One category can contain many products.

CATEGORIA 1 ---- N PRODUCTOS

---

## productos

Fields:

- id_producto — primary key
- nombre_producto
- precio_producto
- id_categoria — foreign key to categorias

Relationship:

One product belongs to one category.

One product can have many images.

PRODUCTO 1 ---- N IMAGENES

---

## imagenes

Fields:

- id_imagen — primary key
- prioridad_imagen — integer, default 0
- url_imagen — URL
- id_producto — foreign key to productos

Images MUST NOT be uploaded or stored as physical files.

The system stores ONLY external image URLs.

Priority determines the order of the images.

Priority 0 represents the product cover image.

A product should have at most one effective cover image with priority 0.

Other images use higher priority values.

If a product does not have any image, display a reusable bakery/product placeholder icon in the UI.

---

# 4. TECHNOLOGY STACK

Use the existing Next.js project.

Required technologies:

- Next.js
- App Router
- TypeScript
- React
- Tailwind CSS
- MySQL
- Prisma ORM if appropriate for the existing project
- bcryptjs or an equivalent simple password hashing solution

Use the existing package manager already configured in the project.

Do not introduce unnecessary frameworks.

Do not create a separate backend such as NestJS or Express.

Next.js must handle both the user interface and the required server-side operations.

---

# 5. ARCHITECTURE

Use a feature-based architecture.

Organize code by business feature instead of placing all application logic together.

A reasonable structure could be similar to:

src/
├── app/
├── components/
├── features/
│   ├── auth/
│   ├── users/
│   ├── categories/
│   └── products/
├── lib/
├── config/
└── types/

Adapt this structure if the existing Next.js project does not use `src`.

Do not restructure the project unnecessarily if an equivalent clean organization already exists.

Each feature should contain the components, server logic, validation and types that belong to that feature when appropriate.

Shared components must be reusable.

Avoid duplicated UI and duplicated business logic.

---

# 6. CODE QUALITY RULES

All source code must be written in English.

Use:

- English variable names.
- English function names.
- English component names.
- English file names when practical.
- Clear and descriptive identifiers.

The UI itself must be in Spanish.

Write clean and self-explanatory code.

DO NOT add explanatory comments to source code.

The code should explain itself through naming and structure.

Avoid:

- giant components
- duplicated code
- unnecessary abstractions
- unnecessary dependencies
- dead code
- hardcoded repeated colors
- business logic directly mixed into presentation when it can be cleanly separated

Keep the solution simple.

---

# 7. DESIGN SYSTEM

The application must have a creative bakery-oriented visual identity.

Main color family:

- Red
- Blue
- Cream

Use variations, neutral tones and appropriate contrast.

Do NOT make the entire interface a single color.

Create one centralized design source for the color palette.

Prefer CSS variables in the global/root stylesheet, for example:

:root {
  --color-primary: ...;
  --color-secondary: ...;
  --color-background: ...;
  --color-surface: ...;
  --color-danger: ...;
  --color-text: ...;
}

Do not repeatedly hardcode the same hexadecimal colors throughout components.

The design must be:

- Modern
- Clean
- Friendly
- Professional
- Appropriate for a bakery
- Visually creative without being overloaded
- Fully responsive

The application must work correctly on:

- Desktop
- Laptop
- Tablet
- Mobile

Tables must remain usable on small screens through responsive strategies.

The sidebar must adapt appropriately on mobile devices.

Use accessible labels, visible focus states and reasonable contrast.

---

# 8. LOGIN PAGE

The first screen is the login page.

Desktop layout:

LEFT SIDE:
- A visually attractive bakery/login illustration or icon.
- Decorative elements consistent with the project palette.

RIGHT SIDE:
- PANADERIA title.
- Username input.
- Password input.
- Login button.

Password input requirements:

- Password characters are hidden by default.
- Include an eye icon.
- Clicking the eye toggles password visibility.

Do not create registration from the login screen.

Users are created by administrators from the administrative application.

Authentication must verify the user against the `usuarios` table.

The user may log in only when:

- The username exists.
- The password is valid.
- `activo` is true.

After successful authentication, redirect to the administrative application.

If authentication fails, display a clear Spanish error message.

---

# 9. AUTHENTICATION AND AUTHORIZATION

There are exactly two roles:

ADMINISTRADOR
AYUDANTE

Authorization must be enforced server-side where required.

Do not rely only on hiding buttons in the UI.

Users must not be able to access unauthorized operations by manually requesting routes or endpoints.

Keep the authentication implementation appropriate and simple for this academic project.

---

# 10. ADMINISTRATIVE LAYOUT

After login, display an administrative layout.

Desktop:

LEFT:
Sidebar navigation.

RIGHT:
Current page content.

The ADMINISTRADOR sidebar contains:

- USUARIOS
- CATEGORIAS
- PRODUCTOS

Also provide:

- Current username/role information.
- Change password action.
- Logout action.

The AYUDANTE sidebar contains ONLY:

- PRODUCTOS

Also provide:

- Change own password action.
- Logout action.

On mobile, transform the sidebar into an appropriate responsive navigation pattern.

---

# 11. USERS MODULE

Only ADMINISTRADOR can access this module.

The administrator can:

- List users.
- Search users.
- Create users.
- Edit users.
- Activate users.
- Deactivate users.
- Change another user's password.
- Change their own password.
- Delete users when appropriate.

An administrator MUST NOT:

- Delete their own account.
- Deactivate their own account.

Only these roles can be assigned:

ADMINISTRADOR
AYUDANTE

The user management page must contain:

- Page title.
- Search controls.
- Search/filter by relevant attributes such as username, role or status.
- "Nuevo usuario" button.
- Users table.
- Actions for each row.

Use modals, dialogs or dedicated forms where appropriate.

Never display stored passwords.

Never return password values to the client unnecessarily.

---

# 12. CATEGORIES MODULE

ADMINISTRADOR can manage categories.

Operations:

- List categories.
- Search categories.
- Create category.
- Edit category.
- Delete a category only when database/business constraints allow it.

Fields:

- nombre_categoria
- descripcion

Category name must remain unique.

The page must contain:

- Page title.
- Search controls.
- Search by relevant attributes.
- "Nueva categoría" button.
- Categories table.
- Row actions.

Display understandable Spanish messages when an operation cannot be completed.

For example, a category referenced by products should not be silently deleted.

---

# 13. PRODUCTS MODULE

Both ADMINISTRADOR and AYUDANTE can access PRODUCTS.

Products must support two visualization modes:

1. Table view.
2. Card/grid view.

Provide a clear toggle between them.

The products page must contain:

- Page title.
- Search controls.
- Filters by useful attributes such as name and category.
- "Nuevo producto" button when the role is allowed to create products.
- Table/card view toggle.
- Product information.
- Product actions.

Product fields:

- nombre_producto
- precio_producto
- id_categoria

Each product must display:

- Product name.
- Price.
- Category.
- Cover image when available.

If the product has no images:

Display the reusable default bakery/product placeholder icon.

Do NOT save this placeholder as an image record in the database.

---

# 14. PRODUCT IMAGE MANAGEMENT

Images are managed inside the context/details of a specific product.

Do NOT create a main sidebar section called IMAGENES.

When opening/managing a product, provide an image management section.

The image management interface must allow:

- List product images.
- Add image by external URL.
- Preview image URL.
- Delete allowed images.
- Identify the cover image.
- Change which image is the cover.
- Manage image priority/order where appropriate.

Database fields:

- id_imagen
- prioridad_imagen
- url_imagen
- id_producto

Priority:

0 = cover image.

Other values represent secondary images.

The interface must clearly identify the cover image.

If the cover image changes, update priorities consistently.

Never upload image files to the server.

Never store image binary data.

Only external URLs are stored.

Handle invalid or unavailable external images gracefully by displaying the default placeholder.

---

# 15. ADMINISTRADOR PRODUCT PERMISSIONS

ADMINISTRADOR can:

- View products.
- Search/filter products.
- Create products.
- Edit products.
- Delete/archive products according to the implemented database capabilities.
- Manage all product images.
- Delete secondary images.
- Change the cover image.
- Manage product information.

Do not invent database fields that do not currently exist without a real requirement.

If physical deletion is used because the current schema does not yet contain an archive/status field, keep the implementation consistent with the existing schema.

If an `activo` field is required to satisfy product archiving, clearly document the required schema change before applying it.

---

# 16. AYUDANTE PRODUCT PERMISSIONS

AYUDANTE can access only PRODUCTS.

AYUDANTE can:

- List products.
- Search/filter products.
- View products.
- Create products.
- Edit products.
- Manage product images.
- Add image URLs.
- Delete secondary images.

AYUDANTE cannot:

- Access users.
- Access category administration.
- Delete products.
- Delete the current cover image directly.

If the assistant wants another image to become the cover, implement a safe cover-change workflow instead of deleting the current cover first.

AYUDANTE can change only their own password.

---

# 17. SEARCH AND FILTERING

Every main module must provide useful search functionality.

USUARIOS:
- Username.
- Role.
- Status.

CATEGORIAS:
- Category name.
- Description when useful.

PRODUCTOS:
- Product name.
- Category.

Search/filter controls must be reusable when practical.

Do not overengineer advanced search.

---

# 18. FEEDBACK AND UX

Every important operation must provide clear feedback in Spanish.

Examples:

- Usuario creado correctamente.
- Producto actualizado correctamente.
- Categoría eliminada correctamente.
- Contraseña actualizada correctamente.
- No se pudo eliminar la categoría porque tiene productos asociados.

Provide:

- Loading states.
- Empty states.
- Error states.
- Confirmation dialogs for destructive operations.

Do not use browser `alert()` as the primary UX solution if a reusable application dialog/toast can reasonably be implemented.

---

# 19. DATA VALIDATION

Validate data both appropriately on the client and server.

At minimum:

Users:
- Username required.
- Password required when creating/changing it.
- Valid role.

Categories:
- Name required.
- Unique category name.

Products:
- Name required.
- Valid non-negative price.
- Existing category required.

Images:
- URL required.
- Valid URL format.
- Existing product required.
- Priority must be non-negative.

Database errors must be translated into understandable application responses.

---

# 20. DATABASE CONNECTION

Configure the application through environment variables.

Do not hardcode database credentials inside application source code.

Provide an `.env.example`.

For local development, the database currently runs through Docker and is exposed through localhost.

Use an environment variable such as:

DATABASE_URL

When the Next.js application is later executed inside Docker Compose, the database hostname will no longer be `localhost`; it should use the Docker service name.

Design the configuration so this can be changed through environment variables without changing application source code.

Do not commit real secrets.

---

# 21. EXISTING DATABASE AND ORM

If Prisma is used, configure it to work with the existing MySQL schema.

Do not accidentally destroy or reset the existing database.

Do not use destructive migration commands against the existing Docker volume without explicit need.

Inspect the existing schema and map ORM models correctly to the existing table and column names.

The existing SQL schema is the source of truth.

---

# 22. DOCKER REQUIREMENTS FOR NEXT.JS

The MySQL Docker infrastructure already exists.

After the web application works correctly against the database, prepare the Next.js application for Docker.

Create an appropriate:

Dockerfile

Also create:

.dockerignore

The Dockerfile should:

- Use an appropriate Node.js image.
- Install dependencies reproducibly.
- Build the Next.js application.
- Run it in production mode.
- Expose port 3000.
- Avoid copying unnecessary files.

The final project must be ready for a Docker Compose architecture conceptually equivalent to:

Browser
   |
   v
Next.js container
   |
   | Docker network
   v
MySQL container
   |
   v
Docker volume

The existing MySQL volume must remain persistent.

Do not destroy the existing database infrastructure.

If a final combined Docker Compose file is created or proposed, preserve the existing MySQL configuration and volume semantics.

---

# 23. SECURITY SCOPE

This is an academic project.

Implement reasonable basic security without turning the project into an enterprise authentication platform.

Required:

- Password hashing for newly created/changed passwords.
- Server-side authorization.
- No passwords returned to the UI.
- Environment variables for credentials.
- Protected administrative routes.
- Validation of server-side operations.

Do not add unnecessary complexity such as:

- OAuth providers.
- Multi-factor authentication.
- Email verification.
- Password recovery emails.
- External identity providers.

---

# 24. RESPONSIVE REQUIREMENT

Responsiveness is mandatory.

Every page must be tested conceptually at:

- Mobile width.
- Tablet width.
- Desktop width.

Avoid layouts that require a desktop resolution.

Tables may use:

- Horizontal scrolling.
- Reduced columns.
- Responsive alternatives.

Cards must reorganize naturally according to available width.

Forms and dialogs must remain usable on mobile.

---

# 25. PROJECT DOCUMENTATION

After completing the implementation, create:

report.md

inside the `panaderia` project.

The report must explain in Spanish:

- What was implemented.
- Project architecture.
- Folder organization.
- Technologies used.
- Authentication implementation.
- Authorization rules.
- ADMINISTRADOR permissions.
- AYUDANTE permissions.
- Database integration.
- Database tables and relationships.
- Product image URL strategy.
- Environment variables.
- How to install dependencies.
- How to run the application locally.
- How the Next.js application connects to MySQL.
- Dockerfile explanation.
- How the application is prepared for Docker.
- Any database schema changes that were required.
- Important implementation decisions.
- Testing/verification steps.
- Useful Docker commands.

The report must be clear enough that another developer can understand and run the project.

---

# 26. IMPLEMENTATION PROCESS

Before modifying code:

1. Inspect the complete existing Next.js project.
2. Inspect package.json.
3. Inspect the existing project structure.
4. Inspect the MySQL database initialization file if accessible.
5. Understand the existing Docker configuration.
6. Preserve working configuration.

Then implement the project incrementally.

Recommended order:

1. Database access.
2. Authentication.
3. Authorization.
4. Administrative layout.
5. Users.
6. Categories.
7. Products.
8. Product images.
9. Responsive improvements.
10. Error/loading/empty states.
11. Dockerfile and .dockerignore.
12. Final verification.
13. report.md.

Do not rewrite working files unnecessarily.

Do not destroy existing infrastructure.

---

# 27. ACCEPTANCE CRITERIA

The project is complete when all of the following are true:

- The application starts correctly.
- It connects to the existing MySQL Docker database.
- PRESI can authenticate as ADMINISTRADOR.
- Inactive users cannot log in.
- ADMINISTRADOR sees USUARIOS, CATEGORIAS and PRODUCTOS.
- AYUDANTE sees only PRODUCTOS.
- Unauthorized routes/actions are protected server-side.
- ADMINISTRADOR can manage users.
- ADMINISTRADOR cannot delete or deactivate themselves.
- Users can change their own password.
- ADMINISTRADOR can change another user's password.
- Categories can be managed.
- Products can be managed.
- Products can be displayed as table or cards.
- Products can be searched and filtered.
- Product images are external URLs only.
- Priority 0 is treated as the cover image.
- Products without images display a default placeholder.
- AYUDANTE cannot delete products.
- AYUDANTE cannot directly delete the cover image.
- The interface is responsive.
- The red/blue/cream design system is consistently used.
- Shared components are reused.
- Source code is in English.
- UI text is in Spanish.
- Source code contains no unnecessary explanatory comments.
- Database credentials are configurable through environment variables.
- A Dockerfile exists for the Next.js application.
- A .dockerignore exists.
- The existing MySQL Docker volume is preserved.
- `report.md` documents the completed implementation.

---

# 28. FINAL INSTRUCTION

Implement the complete application according to this specification.

You have permission to create, modify and organize files inside the Next.js `panaderia` project as necessary.

Do not modify or destroy the existing MySQL Docker volume.

Do not change the fundamental database model without a genuine implementation requirement.

If a schema modification becomes necessary, document exactly what is required and why before making a destructive change.

Prioritize:

1. Correct functionality.
2. Simple architecture.
3. Clean code.
4. Reusable components.
5. Responsive UX/UI.
6. Correct database integration.
7. Role-based authorization.
8. Docker readiness.

Do not stop after creating mock interfaces.

The application must actually communicate with MySQL and perform the required CRUD operations.