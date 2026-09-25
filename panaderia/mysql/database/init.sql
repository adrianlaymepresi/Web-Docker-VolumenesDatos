CREATE DATABASE IF NOT EXISTS panaderia_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE panaderia_db;

CREATE TABLE usuarios (
    id_usuario INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    rol ENUM('ADMINISTRADOR', 'AYUDANTE') NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE categorias (
    id_categoria INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
);

CREATE TABLE productos (
    id_producto INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre_producto VARCHAR(150) NOT NULL,
    precio_producto DECIMAL(10,2) NOT NULL,
    id_categoria INT UNSIGNED NOT NULL,

    CONSTRAINT fk_producto_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categorias(id_categoria)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE imagenes (
    id_imagen INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    prioridad_imagen INT UNSIGNED NOT NULL DEFAULT 0,
    url_imagen VARCHAR(2048) NOT NULL,
    id_producto INT UNSIGNED NOT NULL,

    CONSTRAINT fk_imagen_producto
        FOREIGN KEY (id_producto)
        REFERENCES productos(id_producto)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

INSERT INTO usuarios (usuario, contrasena, rol)
VALUES ('PRESI', '+12Presi21+', 'ADMINISTRADOR');