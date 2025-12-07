CREATE TYPE user_role AS ENUM ('guest', 'expert');
CREATE TYPE resource_type AS ENUM ('lake', 'canal', 'reservoir', 'lock', 'hydro-unit');
CREATE TYPE water_type AS ENUM ('fresh', 'non-fresh');
CREATE TYPE fauna_presence AS ENUM ('yes', 'no', 'unknown');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    login VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'guest',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE water_objects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    region VARCHAR(100) NOT NULL,
    resource_type resource_type NOT NULL,
    water_type water_type NOT NULL,
    fauna fauna_presence NOT NULL DEFAULT 'unknown',
    passport_date DATE NOT NULL,
    technical_condition INTEGER CHECK (technical_condition BETWEEN 1 AND 5),
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    description TEXT,
    area_ha FLOAT,
    depth_m FLOAT,
    pdf_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_water_objects_name ON water_objects (name);
CREATE INDEX idx_water_objects_region ON water_objects (region);
