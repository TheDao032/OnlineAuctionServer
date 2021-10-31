--
-- PostgreSQL database dump
--

-- Dumped from database version 14.0
-- Dumped by pg_dump version 14.0

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
    acc_upgrade_status integer,
    acc_token_forgot character varying(100),
    acc_refresh_token character varying(100),
    acc_created_date timestamp without time zone,
    acc_updated_date timestamp without time zone
);


ALTER TABLE public.tbl_account OWNER TO postgres;

--
-- Name: tbl_auction_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_auction_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_auction_id_seq OWNER TO postgres;

--
-- Name: tbl_auction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_auction (
    auc_id integer DEFAULT nextval('public.tbl_auction_id_seq'::regclass) NOT NULL,
    auc_bidder_id integer,
    auc_prod_id integer,
    auc_price_offer double precision,
    auc_created_date timestamp without time zone,
    auc_updated_date timestamp without time zone
);


ALTER TABLE public.tbl_auction OWNER TO postgres;

--
-- Name: tbl_auction_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_auction_status_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_auction_status_id_seq OWNER TO postgres;

--
-- Name: tbl_auction_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_auction_status (
    stt_id integer DEFAULT nextval('public.tbl_auction_status_id_seq'::regclass) NOT NULL,
    stt_bidder_id integer,
    stt_prod_id integer,
    stt_is_biggest integer,
    stt_biggest_price double precision,
    stt_created_date timestamp without time zone,
    stt_updated_date timestamp without time zone
);


ALTER TABLE public.tbl_auction_status OWNER TO postgres;

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
    cate_created_date timestamp without time zone,
    cate_updated_date timestamp without time zone,
    ts tsvector GENERATED ALWAYS AS (setweight(to_tsvector('english'::regconfig, (COALESCE(cate_name, ''::character varying))::text), 'A'::"char")) STORED
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
    cmt_vote integer,
    cmt_content text,
    cmt_from_id integer NOT NULL,
    cmt_to_id integer NOT NULL,
    cmt_created_date timestamp without time zone,
    cmt_updated_date timestamp without time zone
);


ALTER TABLE public.tbl_comment OWNER TO postgres;

--
-- Name: tbl_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_permission_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_permission_id_seq OWNER TO postgres;

--
-- Name: tbl_permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_permission (
    per_id integer DEFAULT nextval('public.tbl_permission_id_seq'::regclass) NOT NULL,
    per_bidder_id integer,
    per_seller_id integer,
    per_prod_id integer,
    per_is_cancle integer,
    per_can_auction integer,
    per_created_date timestamp without time zone,
    per_updated_date timestamp without time zone
);


ALTER TABLE public.tbl_permission OWNER TO postgres;

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
    prod_name character varying(100),
    prod_cate_id integer,
    prod_acc_id integer,
    prod_offer_number integer,
    prod_begin_price double precision,
    prod_step_price double precision,
    prod_buy_price double precision,
    prod_created_date timestamp without time zone,
    prod_expired_date timestamp without time zone,
    prod_updated_date timestamp without time zone,
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
    prod_desc_created_date timestamp without time zone,
    prod_desc_updated_date timestamp without time zone
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
    prod_img_src character varying(100),
    prod_img_src_id character varying(100)
);


ALTER TABLE public.tbl_product_images OWNER TO postgres;

--
-- Name: tbl_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_roles (
    rol_id character varying(5) NOT NULL,
    rol_name character varying(100),
    rol_created_date timestamp without time zone,
    rol_updated_date timestamp without time zone
);


ALTER TABLE public.tbl_roles OWNER TO postgres;

--
-- Name: tbl_watch_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_watch_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_watch_id_seq OWNER TO postgres;

--
-- Name: tbl_watch; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_watch (
    watch_id integer DEFAULT nextval('public.tbl_watch_id_seq'::regclass) NOT NULL,
    watch_acc_id integer,
    watch_prod_id integer,
    watch_created_date timestamp without time zone,
    watch_updated_date timestamp without time zone
);


ALTER TABLE public.tbl_watch OWNER TO postgres;

--
-- Data for Name: tbl_account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_account (acc_id, acc_password, acc_token, acc_email, acc_phone_number, acc_full_name, acc_role, acc_avatar, acc_status, acc_token_forgot, acc_refresh_token, acc_created_date, acc_updated_date) FROM stdin;
2	$2b$04$RKApZStqzmlWnaJ4iIQT1OqNKWm1da4Bxv63HV8PXroLJMkaRHRy2	\N	admin@gmail.com	\N	\N	ADM	\N	0	\N	Tp4XQgfPGgMqzdz7Tl2JQJQjtZ68WOWjWoqLwsJ7syOSfCt2d4CeGrBkdECao8FxuYWOnSrEn3oC6LfUJjnPdI7TSRsHLIWC8cXO	2021-09-16 00:00:00	2021-09-16 00:00:00
4	$2b$04$RKApZStqzmlWnaJ4iIQT1OqNKWm1da4Bxv63HV8PXroLJMkaRHRy2	\N	seller2@gmail.com	\N	\N	SEL	\N	0	\N	Tp4XQgfPGgMqzdz7Tl2JQJQjtZ68WOWjWoqLwsJ7syOSfCt2d4CeGrBkdECao8FxuYWOnSrEn3oC6LfUJjnPdI7TSRsHLIWC8cXO	2021-09-16 00:00:00	2021-09-16 00:00:00
7	$2b$04$RKApZStqzmlWnaJ4iIQT1OqNKWm1da4Bxv63HV8PXroLJMkaRHRy2	\N	bidder3@gmail.com	\N	\N	BID	\N	0	\N	\N	2021-09-16 00:00:00	2021-09-16 00:00:00
5	$2b$04$RKApZStqzmlWnaJ4iIQT1OqNKWm1da4Bxv63HV8PXroLJMkaRHRy2	\N	bidder@gmail.com	\N	\N	BID	\N	0	\N	TObyZ3M5qEWFDAdl0LdjlhNmibQDHL6lH7WGbcxeA1jM2fTqO5FB9IaLjLseyHVla1UbtEdtFcgQMkGW2CgmNd7Zl8shBHubbzKL	2021-09-16 00:00:00	2021-09-16 00:00:00
6	$2b$04$RKApZStqzmlWnaJ4iIQT1OqNKWm1da4Bxv63HV8PXroLJMkaRHRy2	\N	bidder2@gmail.com	\N	\N	BID	\N	0	\N	5pgqkcxAw0DMKx1TuiX8gtoSnIedXZdkFgWs4wAOeUKoy3WU4tzE5nd8UW8TIeiNfYP7mKe3lnCGOESdl1JsU0CGz4cSH2oQBXYe	2021-09-16 00:00:00	2021-09-16 00:00:00
3	$2b$04$RKApZStqzmlWnaJ4iIQT1OqNKWm1da4Bxv63HV8PXroLJMkaRHRy2	\N	seller@gmail.com	\N	\N	SEL	\N	0	\N	4sxBdsw9tFbai50uduHnmYelNpEZ7n4A8pAhYYqDd5bFqVkx4lF1GFnVSNSCG2Hvg5BAtUeZNsbiJT6n64MsQWaol34cZPUsRTJD	2021-09-16 00:00:00	2021-09-16 00:00:00
\.


--
-- Data for Name: tbl_auction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_auction (auc_id, auc_bidder_id, auc_prod_id, auc_price_offer, auc_created_date, auc_updated_date) FROM stdin;
9	5	1	1000.25	2021-10-23 21:10:03	2021-10-23 21:10:03
10	6	1	1100.25	2021-10-23 21:20:48	2021-10-23 21:20:48
11	5	1	2000.25	2021-10-23 21:21:05	2021-10-23 21:21:05
12	6	1	2100.25	2021-10-23 21:23:22	2021-10-23 21:23:22
\.


--
-- Data for Name: tbl_auction_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_auction_status (stt_id, stt_bidder_id, stt_prod_id, stt_is_biggest, stt_biggest_price, stt_created_date, stt_updated_date) FROM stdin;
9	6	1	1	1100.25	2021-10-23 21:20:48	2021-10-23 21:23:22
8	5	1	1	1000.25	2021-10-23 21:10:03	2021-10-23 22:36:49
11	6	1	1	2100.25	2021-10-23 21:23:22	2021-10-23 22:40:18
10	5	1	0	1200.25	2021-10-23 21:21:05	2021-10-23 22:40:18
\.


--
-- Data for Name: tbl_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_categories (cate_id, cate_name, cate_father, cate_created_date, cate_updated_date) FROM stdin;
1	Điện Tử	\N	2021-09-16 23:44:23	2021-09-16 23:44:23
3	Máy Tính	1	2021-09-27 23:44:23	2021-09-27 23:44:23
5	Nghệ Thuật	\N	2021-09-27 23:44:23	2021-09-27 23:44:23
6	Đá Quý	\N	2021-09-27 23:44:23	2021-09-27 23:44:23
4	TV	1	2021-09-27 23:44:23	2021-09-27 23:44:23
11	Tranh Ảnh	5	2021-10-04 18:53:55	2021-10-04 18:53:55
12	Tượng	5	2021-10-04 18:55:29	2021-10-04 18:55:29
13	Kim Cương	6	2021-10-04 18:56:37	2021-10-04 18:56:37
14	Hồng Ngọc	6	2021-10-04 18:57:06	2021-10-04 18:57:06
2	Đồ Cổ	\N	2021-09-27 23:44:23	2021-09-27 23:44:23
9	Gốm Sứ	2	2021-10-04 18:13:47	2021-10-04 18:13:47
10	Tượng Cổ	2	2021-10-04 18:52:26	2021-10-04 18:52:26
\.


--
-- Data for Name: tbl_comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_comment (cmt_id, cmt_vote, cmt_content, cmt_from_id, cmt_to_id, cmt_created_date, cmt_updated_date) FROM stdin;
\.


--
-- Data for Name: tbl_permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_permission (per_id, per_bidder_id, per_seller_id, per_prod_id, per_is_cancle, per_can_auction, per_created_date, per_updated_date) FROM stdin;
1	5	3	1	\N	0	\N	\N
2	6	3	1	\N	1	\N	2021-10-23 22:40:18
\.


--
-- Data for Name: tbl_product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_product (prod_id, prod_name, prod_cate_id, prod_acc_id, prod_offer_number, prod_begin_price, prod_step_price, prod_buy_price, prod_created_date, prod_expired_date, prod_updated_date) FROM stdin;
8	Tượng Venus	12	4	5	10000000	100	100000000	2021-10-05 23:06:20	2021-10-06 20:14:20	2021-10-06 01:06:20
7	Tượng David	12	4	10	8888	100	100000000	2021-10-05 23:04:20	2021-10-06 20:14:20	2021-10-05 22:48:33
6	The Last Supper	4	4	19	95131351	100	100000000	2021-10-05 23:00:12	2021-10-06 20:00:12	2021-10-05 23:00:12
5	Mona Lisa	11	4	8	1000.25	100	100000000	2021-10-05 22:59:58	2021-10-06 20:59:58	2021-10-05 22:59:58
4	LG Smart TV 55UP7550PTC	4	3	6	4000	100	100000000	2021-10-05 22:56:21	2021-10-06 21:49:21	2021-10-05 22:56:21
2	MacBook Pro	3	3	3	2000.5	100	100000000	2021-10-05 22:54:25	2021-10-06 22:54:25	2021-10-05 22:54:25
14	Test	12	4	18	1000.25	100	9053515	2021-10-08 00:51:12	2021-10-09 00:51:12	2021-10-08 00:51:12
3	Samsung Smart TV QLED QA55Q65A	4	3	5	1000.25	100	100000000	2021-10-05 22:56:07	2021-10-08 21:50:07	2021-10-22 13:58:44
1	MacBook Air	3	3	2	1000.25	100	100000000	2021-10-05 22:48:33	2021-10-06 22:48:33	2021-10-23 21:10:03
\.


--
-- Data for Name: tbl_product_description; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_product_description (prod_desc_id, prod_desc_prod_id, prod_desc_content, prod_desc_created_date, prod_desc_updated_date) FROM stdin;
1	\N		2021-10-05 22:48:33	2021-10-05 22:48:33
2	\N		2021-10-05 22:54:25	2021-10-05 22:54:25
3	\N		2021-10-05 22:56:07	2021-10-05 22:56:07
4	\N		2021-10-05 22:56:21	2021-10-05 22:56:21
5	\N		2021-10-05 22:59:58	2021-10-05 22:59:58
6	\N		2021-10-05 23:00:12	2021-10-05 23:00:12
7	\N		2021-10-05 23:04:20	2021-10-05 23:04:20
8	\N		2021-10-05 23:06:20	2021-10-05 23:06:20
9	12		2021-10-07 21:16:11	2021-10-07 21:16:11
10	13		2021-10-07 21:16:58	2021-10-07 21:16:58
11	14		2021-10-08 00:51:12	2021-10-08 00:51:12
\.


--
-- Data for Name: tbl_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_roles (rol_id, rol_name, rol_created_date, rol_updated_date) FROM stdin;
ADM	Admin	2021-10-04 17:47:47.623473	2021-10-04 17:47:47.623473
SEL	Seller	2021-10-04 17:48:49.828857	2021-10-04 17:48:49.828857
BID	Bidder	2021-10-04 18:59:18.144391	2021-10-04 18:59:18.144391
\.


--
-- Data for Name: tbl_watch; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_watch (watch_id, watch_acc_id, watch_prod_id, watch_created_date, watch_updated_date) FROM stdin;
\.


--
-- Name: tbl_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_account_id_seq', 7, true);


--
-- Name: tbl_auction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_auction_id_seq', 12, true);


--
-- Name: tbl_auction_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_auction_status_id_seq', 11, true);


--
-- Name: tbl_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_categories_id_seq', 14, true);


--
-- Name: tbl_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_comment_id_seq', 1, false);


--
-- Name: tbl_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_permission_id_seq', 2, true);


--
-- Name: tbl_product_description_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_product_description_id_seq', 11, true);


--
-- Name: tbl_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_product_id_seq', 14, true);


--
-- Name: tbl_product_image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_product_image_id_seq', 15, true);


--
-- Name: tbl_watch_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_watch_id_seq', 1, false);


--
-- Name: tbl_account tbl_account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_account
    ADD CONSTRAINT tbl_account_pkey PRIMARY KEY (acc_id);


--
-- Name: tbl_auction tbl_auction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_auction
    ADD CONSTRAINT tbl_auction_pkey PRIMARY KEY (auc_id);


--
-- Name: tbl_auction_status tbl_auction_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_auction_status
    ADD CONSTRAINT tbl_auction_status_pkey PRIMARY KEY (stt_id);


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
-- Name: tbl_permission tbl_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_permission
    ADD CONSTRAINT tbl_permission_pkey PRIMARY KEY (per_id);


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
-- Name: tbl_watch tbl_watch_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_watch
    ADD CONSTRAINT tbl_watch_pkey PRIMARY KEY (watch_id);


--
-- Name: tbl_account tbl_account_roles_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_account
    ADD CONSTRAINT tbl_account_roles_fkey FOREIGN KEY (acc_role) REFERENCES public.tbl_roles(rol_id);


--
-- Name: tbl_comment tbl_cmt_from_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_comment
    ADD CONSTRAINT tbl_cmt_from_id_fkey FOREIGN KEY (cmt_from_id) REFERENCES public.tbl_account(acc_id) NOT VALID;


--
-- Name: tbl_comment tbl_cmt_to_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_comment
    ADD CONSTRAINT tbl_cmt_to_id_fkey FOREIGN KEY (cmt_to_id) REFERENCES public.tbl_account(acc_id) NOT VALID;


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

