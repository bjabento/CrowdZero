DROP TABLE if exists admins;
DROP TABLE if exists feedback;
DROP TABLE if exists reports;
DROP TABLE if exists users;
DROP TABLE if exists locals;

-----------------------------------------
-- Table: Admins
-----------------------------------------
CREATE TABLE admins(
  idA SERIAL PRIMARY KEY NOT NULL,
  tipo INT NOT NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  pass TEXT NOT NULL,
  contacto INT NOT NULL,
  cc INT UNIQUE NOT NULL);

-----------------------------------------
-- Table: Users
-----------------------------------------
CREATE TABLE users(
  idU SERIAL PRIMARY KEY NOT NULL, 
  cargo INT,
  nome TEXT NOT NULL,
  idade INT,
  email TEXT NOT NULL,
  pass TEXT,
  contacto INT,
  cc INT UNIQUE NOT NULL,
  idGoogle INT);

-----------------------------------------
-- Table: Locals
-----------------------------------------
CREATE TABLE locals(
  idL SERIAL PRIMARY KEY NOT NULL,
  nome TEXT NOT NULL,
  latitude VARCHAR(12) NOT NULL,
  longitude VARCHAR(13) NOT NULL,
  lotacao INT NOT NULL,
  estado INT NOT NULL);

-----------------------------------------
-- Table: Reports
-----------------------------------------
CREATE TABLE reports(
  idR SERIAL PRIMARY KEY NOT NULL,
  idL INT NOT NULL,
  idU INT NOT NULL,
  nivel INT NOT NULL,
  CONSTRAINT fk_locals FOREIGN KEY(idL) REFERENCES locals(idL),
  CONSTRAINT fk_users FOREIGN KEY(idU) REFERENCES users(idU));

  -----------------------------------------
-- Table: Feedback
-----------------------------------------
CREATE TABLE feedback(
  idF SERIAL PRIMARY KEY NOT NULL,
  idR INT NOT NULL,
  idU INT NOT NULL,
  feedback BOOLEAN NOT NULL,
  CONSTRAINT fk_reports FOREIGN KEY(idR) REFERENCES reports(idR),
  CONSTRAINT fk_users FOREIGN KEY(idU) REFERENCES users(idU));