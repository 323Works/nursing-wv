--
-- PostgreSQL database dump
--

\restrict 40jiuBAVnZXh9bKRLPwPGmNzA8RRuGu7J4JKauTEoJE75fJZBwJkkD3bheFFh6D

-- Dumped from database version 16.14 (422d414)
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


--
-- Name: lapsed_aprn; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lapsed_aprn (
    id integer NOT NULL,
    license_number character varying(20) NOT NULL,
    license_type character varying(20) NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    location character varying(200) NOT NULL,
    expiration_date date NOT NULL,
    status character varying(20) NOT NULL
);


--
-- Name: lapsed_aprn_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.lapsed_aprn_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: lapsed_aprn_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.lapsed_aprn_id_seq OWNED BY public.lapsed_aprn.id;


--
-- Name: nursing_licensees; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nursing_licensees (
    id integer NOT NULL,
    credential_code character varying(32) NOT NULL,
    license_number character varying(16) NOT NULL,
    name_raw text NOT NULL,
    last_name character varying(128) NOT NULL,
    first_name character varying(128) NOT NULL,
    middle_names character varying(128),
    created_at timestamp with time zone NOT NULL,
    source_file character varying(255) NOT NULL,
    source_generated_at timestamp with time zone,
    prescriptive_authority_lapsed boolean DEFAULT false NOT NULL,
    prescriptive_authority_expiration_date date,
    location character varying(200)
);


--
-- Name: nursing_licensees_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nursing_licensees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nursing_licensees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nursing_licensees_id_seq OWNED BY public.nursing_licensees.id;


--
-- Name: lapsed_aprn id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lapsed_aprn ALTER COLUMN id SET DEFAULT nextval('public.lapsed_aprn_id_seq'::regclass);


--
-- Name: nursing_licensees id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nursing_licensees ALTER COLUMN id SET DEFAULT nextval('public.nursing_licensees_id_seq'::regclass);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: lapsed_aprn lapsed_aprn_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lapsed_aprn
    ADD CONSTRAINT lapsed_aprn_pkey PRIMARY KEY (id);


--
-- Name: nursing_licensees nursing_licensees_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nursing_licensees
    ADD CONSTRAINT nursing_licensees_pkey PRIMARY KEY (id);


--
-- Name: idx_nursing_licensees_last_first; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_nursing_licensees_last_first ON public.nursing_licensees USING btree (last_name, first_name);


--
-- Name: idx_prescriptive_authority_lapsed; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_prescriptive_authority_lapsed ON public.nursing_licensees USING btree (prescriptive_authority_lapsed);


--
-- Name: ix_lapsed_aprn_license_number; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_lapsed_aprn_license_number ON public.lapsed_aprn USING btree (license_number);


--
-- Name: ix_nursing_licensees_credential_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_nursing_licensees_credential_code ON public.nursing_licensees USING btree (credential_code);


--
-- Name: ix_nursing_licensees_first_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_nursing_licensees_first_name ON public.nursing_licensees USING btree (first_name);


--
-- Name: ix_nursing_licensees_last_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_nursing_licensees_last_name ON public.nursing_licensees USING btree (last_name);


--
-- Name: ix_nursing_licensees_license_number; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_nursing_licensees_license_number ON public.nursing_licensees USING btree (license_number);


--
-- PostgreSQL database dump complete
--

\unrestrict 40jiuBAVnZXh9bKRLPwPGmNzA8RRuGu7J4JKauTEoJE75fJZBwJkkD3bheFFh6D
