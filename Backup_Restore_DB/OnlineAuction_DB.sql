--
-- PostgreSQL database dump
--

-- Dumped from database version 13.4
-- Dumped by pg_dump version 13.4

SET statement_timestampout = 0;
SET lock_timestampout = 0;
SET idle_in_transaction_session_timestampout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: tbl_account_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_account_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_account_id_seq OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: tbl_account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_account (
    acc_id integer DEFAULT nextval('public.tbl_account_id_seq'::regclass) NOT NULL,
    acc_password character varying(100),
    acc_token character varying(100),
    acc_email character varying(100),
    acc_phone_number character varying(15),
    acc_full_name character varying(100),
    acc_role character varying(5),
    acc_avatar text,
    acc_status integer DEFAULT 2,
    acc_token_forgot character varying(100),
    acc_refresh_token character varying(100),
    acc_created_date timestamp,
    acc_updated_date timestamp
);


ALTER TABLE public.tbl_account OWNER TO postgres;

--
-- Name: tbl_cart_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_cart_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_cart_id_seq OWNER TO postgres;

--
-- Name: tbl_cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_cart (
    cart_id integer DEFAULT nextval('public.tbl_cart_id_seq'::regclass) NOT NULL,
    cart_acc_id integer,
    cart_prod_id integer,
    cart_created_date timestamp,
    cart_updated_date timestamp
);


ALTER TABLE public.tbl_cart OWNER TO postgres;

--
-- Name: tbl_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_categories_id_seq OWNER TO postgres;

--
-- Name: tbl_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_categories (
    cate_id integer DEFAULT nextval('public.tbl_categories_id_seq'::regclass) NOT NULL,
    cate_name character varying(100),
    cate_father integer,
    cate_created_date timestamp,
    cate_updated_date timestamp
);


ALTER TABLE public.tbl_categories OWNER TO postgres;

--
-- Name: tbl_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_comment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_comment_id_seq OWNER TO postgres;

--
-- Name: tbl_comment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_comment (
    cmt_id integer DEFAULT nextval('public.tbl_comment_id_seq'::regclass) NOT NULL,
    cmt_grade integer,
    cmt_content text,
    cmt_acc_id integer NOT NULL,
    cmt_owner_id integer NOT NULL,
    cmt_created_date timestamp,
    cmt_updated_date timestamp
);


ALTER TABLE public.tbl_comment OWNER TO postgres;

--
-- Name: tbl_product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_product_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_product_id_seq OWNER TO postgres;

--
-- Name: tbl_product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_product (
    prod_id integer DEFAULT nextval('public.tbl_product_id_seq'::regclass) NOT NULL,
    prod_name character varying(60),
    prod_cate_id integer,
    prod_price double precision,
    prod_created_date timestamp,
    prod_updated_date timestamp,
    ts tsvector GENERATED ALWAYS AS (setweight(to_tsvector('english'::regconfig, (COALESCE(prod_name, ''::character varying))::text), 'A'::"char")) STORED
);


ALTER TABLE public.tbl_product OWNER TO postgres;

--
-- Name: tbl_product_description_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_product_description_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_product_description_id_seq OWNER TO postgres;

--
-- Name: tbl_product_description; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_product_description (
    prod_desc_id integer DEFAULT nextval('public.tbl_product_description_id_seq'::regclass) NOT NULL,
    prod_desc_prod_id integer,
    prod_desc_content text,
    prod_desc_created_date timestamp,
    prod_desc_updated_date timestamp
);


ALTER TABLE public.tbl_product_description OWNER TO postgres;

--
-- Name: tbl_product_image_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_product_image_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_product_image_id_seq OWNER TO postgres;

--
-- Name: tbl_product_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_product_images (
    prod_img_id integer DEFAULT nextval('public.tbl_product_image_id_seq'::regclass) NOT NULL,
    prod_img_product_id integer NOT NULL,
    prod_img_data text
);


ALTER TABLE public.tbl_product_images OWNER TO postgres;

--
-- Name: tbl_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_roles (
    rol_id character varying(5) NOT NULL,
    rol_name character varying(5),
    rol_created_date timestamp,
    rol_updated_date timestamp
);


ALTER TABLE public.tbl_roles OWNER TO postgres;

--
-- Data for Name: tbl_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_roles (rol_id, rol_name, rol_created_date, rol_updated_date) FROM stdin;
ADM	Admin	2021-09-16	2021-09-16
USER	User	2021-09-16	2021-09-16
\.

--
-- Data for Name: tbl_account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_account (acc_id, acc_password, acc_token, acc_email, acc_phone_number, acc_full_name, acc_role, acc_avatar, acc_status, acc_token_forgot, acc_refresh_token, acc_created_date, acc_updated_date) FROM stdin;
2	$2b$04$RKApZStqzmlWnaJ4iIQT1OqNKWm1da4Bxv63HV8PXroLJMkaRHRy2	\N	nthedao2705@gmail.com	\N	\N	ADM	\N	0	\N	rOcH9drBkKHYiM1bzTEBJRIJ1AYTcrLcPqWZwDV30YcvtvLvAWht5pggR0s4Qq5kkt2vakPUqlf7NBG5mDBEMgtSuYSoVE9EJRKd	2021-09-16	2021-09-16
\.


--
-- Data for Name: tbl_cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_cart (cart_id, cart_acc_id, cart_prod_id, cart_created_date, cart_updated_date) FROM stdin;
\.


--
-- Data for Name: tbl_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_categories (cate_id, cate_name, cate_father, cate_created_date, cate_updated_date) FROM stdin;
\.


--
-- Data for Name: tbl_comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_comment (cmt_id, cmt_grade, cmt_content, cmt_acc_id, cmt_owner_id, cmt_created_date, cmt_updated_date) FROM stdin;
\.


--
-- Data for Name: tbl_product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_product (prod_id, prod_name, prod_cate_id, prod_price, prod_created_date, prod_updated_date) FROM stdin;
\.


--
-- Data for Name: tbl_product_description; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_product_description (prod_desc_id, prod_desc_prod_id, prod_desc_content, prod_desc_created_date, prod_desc_updated_date) FROM stdin;
\.


--
-- Data for Name: tbl_product_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_product_images (prod_img_id, prod_img_product_id, prod_img_data) FROM stdin;
\.

--
-- Name: tbl_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_account_id_seq', 2, true);


--
-- Name: tbl_cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_cart_id_seq', 1, false);


--
-- Name: tbl_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_categories_id_seq', 1, false);


--
-- Name: tbl_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_comment_id_seq', 1, false);


--
-- Name: tbl_product_description_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_product_description_id_seq', 1, false);


--
-- Name: tbl_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_product_id_seq', 1, false);


--
-- Name: tbl_product_image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_product_image_id_seq', 1, false);


--
-- Name: tbl_account tbl_account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_account
    ADD CONSTRAINT tbl_account_pkey PRIMARY KEY (acc_id);


--
-- Name: tbl_cart tbl_cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_cart
    ADD CONSTRAINT tbl_cart_pkey PRIMARY KEY (cart_id);


--
-- Name: tbl_categories tbl_categiries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_categories
    ADD CONSTRAINT tbl_categiries_pkey PRIMARY KEY (cate_id);


--
-- Name: tbl_comment tbl_comment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_comment
    ADD CONSTRAINT tbl_comment_pkey PRIMARY KEY (cmt_id);


--
-- Name: tbl_product_description tbl_product_description_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_product_description
    ADD CONSTRAINT tbl_product_description_pkey PRIMARY KEY (prod_desc_id);


--
-- Name: tbl_product_images tbl_product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_product_images
    ADD CONSTRAINT tbl_product_images_pkey PRIMARY KEY (prod_img_id, prod_img_product_id);


--
-- Name: tbl_product tbl_product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_product
    ADD CONSTRAINT tbl_product_pkey PRIMARY KEY (prod_id);


--
-- Name: tbl_roles tbl_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_roles
    ADD CONSTRAINT tbl_roles_pkey PRIMARY KEY (rol_id);


--
-- Name: tbl_account tbl_account_roles_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_account
    ADD CONSTRAINT tbl_account_roles_fkey FOREIGN KEY (acc_role) REFERENCES public.tbl_roles(rol_id);


--
-- Name: tbl_comment tbl_cmt_acc_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_comment
    ADD CONSTRAINT tbl_cmt_acc_id_fkey FOREIGN KEY (cmt_acc_id) REFERENCES public.tbl_account(acc_id) NOT VALID;


--
-- Name: tbl_product_images tbl_prod_img_prod_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_product_images
    ADD CONSTRAINT tbl_prod_img_prod_fkey FOREIGN KEY (prod_img_product_id) REFERENCES public.tbl_product(prod_id);


--
-- Name: tbl_product tbl_product_categories_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_product
    ADD CONSTRAINT tbl_product_categories_fkey FOREIGN KEY (prod_cate_id) REFERENCES public.tbl_categories(cate_id);


--
-- PostgreSQL database dump complete
--

