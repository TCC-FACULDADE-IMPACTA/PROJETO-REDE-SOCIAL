--
-- PostgreSQL database dump
--

\restrict NkcH4wNg7ktylWw7osPwljo3wfLvPdlMqU5mkAmgI3z9UGe27pojgw1kg8PNgYf

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-03-14 01:08:28

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- TOC entry 222 (class 1259 OID 16402)
-- Name: credenciais; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.credenciais (
    id integer NOT NULL,
    email character varying(50),
    senha text,
    usuario_id integer
);


ALTER TABLE public.credenciais OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16401)
-- Name: credenciais_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.credenciais_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.credenciais_id_seq OWNER TO postgres;

--
-- TOC entry 4964 (class 0 OID 0)
-- Dependencies: 221
-- Name: credenciais_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.credenciais_id_seq OWNED BY public.credenciais.id;


--
-- TOC entry 228 (class 1259 OID 16453)
-- Name: postagem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.postagem (
    id integer NOT NULL,
    gif bytea,
    descricao text,
    usuario_id integer
);


ALTER TABLE public.postagem OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16452)
-- Name: postagem_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.postagem_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.postagem_id_seq OWNER TO postgres;

--
-- TOC entry 4965 (class 0 OID 0)
-- Dependencies: 227
-- Name: postagem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.postagem_id_seq OWNED BY public.postagem.id;


--
-- TOC entry 224 (class 1259 OID 16419)
-- Name: reset_senha; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reset_senha (
    id integer NOT NULL,
    token text,
    credenciais_id integer
);


ALTER TABLE public.reset_senha OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16418)
-- Name: reset_senha_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reset_senha_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reset_senha_id_seq OWNER TO postgres;

--
-- TOC entry 4966 (class 0 OID 0)
-- Dependencies: 223
-- Name: reset_senha_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reset_senha_id_seq OWNED BY public.reset_senha.id;


--
-- TOC entry 226 (class 1259 OID 16436)
-- Name: token_verificacao_email; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.token_verificacao_email (
    id integer NOT NULL,
    token text,
    verificado boolean,
    usuario_id integer
);


ALTER TABLE public.token_verificacao_email OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16435)
-- Name: token_verificacao_email_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.token_verificacao_email_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.token_verificacao_email_id_seq OWNER TO postgres;

--
-- TOC entry 4967 (class 0 OID 0)
-- Dependencies: 225
-- Name: token_verificacao_email_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.token_verificacao_email_id_seq OWNED BY public.token_verificacao_email.id;


--
-- TOC entry 220 (class 1259 OID 16390)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nome character varying(150),
    foto bytea,
    username character varying(150),
    aniversario date
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16389)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 4968 (class 0 OID 0)
-- Dependencies: 219
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 4776 (class 2604 OID 16405)
-- Name: credenciais id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credenciais ALTER COLUMN id SET DEFAULT nextval('public.credenciais_id_seq'::regclass);


--
-- TOC entry 4779 (class 2604 OID 16456)
-- Name: postagem id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postagem ALTER COLUMN id SET DEFAULT nextval('public.postagem_id_seq'::regclass);


--
-- TOC entry 4777 (class 2604 OID 16422)
-- Name: reset_senha id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reset_senha ALTER COLUMN id SET DEFAULT nextval('public.reset_senha_id_seq'::regclass);


--
-- TOC entry 4778 (class 2604 OID 16439)
-- Name: token_verificacao_email id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token_verificacao_email ALTER COLUMN id SET DEFAULT nextval('public.token_verificacao_email_id_seq'::regclass);


--
-- TOC entry 4775 (class 2604 OID 16393)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 4952 (class 0 OID 16402)
-- Dependencies: 222
-- Data for Name: credenciais; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.credenciais (id, email, senha, usuario_id) FROM stdin;
1	ana@email.com	teste	1
2	carlos@email.com	teste	2
3	juliana@email.com	teste	3
4	marcos@email.com	teste	4
5	fernanda@email.com	teste	5
\.


--
-- TOC entry 4958 (class 0 OID 16453)
-- Dependencies: 228
-- Data for Name: postagem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.postagem (id, gif, descricao, usuario_id) FROM stdin;
\.


--
-- TOC entry 4954 (class 0 OID 16419)
-- Dependencies: 224
-- Data for Name: reset_senha; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reset_senha (id, token, credenciais_id) FROM stdin;
\.


--
-- TOC entry 4956 (class 0 OID 16436)
-- Dependencies: 226
-- Data for Name: token_verificacao_email; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.token_verificacao_email (id, token, verificado, usuario_id) FROM stdin;
\.


--
-- TOC entry 4950 (class 0 OID 16390)
-- Dependencies: 220
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, nome, foto, username, aniversario) FROM stdin;
1	Ana Souza	\N	anasouza	1995-03-12
2	Carlos Mendes	\N	carlmendes	1990-07-25
3	Juliana Ribeiro	\N	juliribeiro	1998-11-04
4	Marcos Lima	\N	marcoslima	1992-01-19
5	Fernanda Alves	\N	feralves	1996-09-30
\.


--
-- TOC entry 4969 (class 0 OID 0)
-- Dependencies: 221
-- Name: credenciais_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.credenciais_id_seq', 5, true);


--
-- TOC entry 4970 (class 0 OID 0)
-- Dependencies: 227
-- Name: postagem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.postagem_id_seq', 1, false);


--
-- TOC entry 4971 (class 0 OID 0)
-- Dependencies: 223
-- Name: reset_senha_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reset_senha_id_seq', 1, false);


--
-- TOC entry 4972 (class 0 OID 0)
-- Dependencies: 225
-- Name: token_verificacao_email_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.token_verificacao_email_id_seq', 1, false);


--
-- TOC entry 4973 (class 0 OID 0)
-- Dependencies: 219
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 5, true);


--
-- TOC entry 4785 (class 2606 OID 16412)
-- Name: credenciais credenciais_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credenciais
    ADD CONSTRAINT credenciais_email_key UNIQUE (email);


--
-- TOC entry 4787 (class 2606 OID 16410)
-- Name: credenciais credenciais_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credenciais
    ADD CONSTRAINT credenciais_pkey PRIMARY KEY (id);


--
-- TOC entry 4797 (class 2606 OID 16461)
-- Name: postagem postagem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postagem
    ADD CONSTRAINT postagem_pkey PRIMARY KEY (id);


--
-- TOC entry 4789 (class 2606 OID 16427)
-- Name: reset_senha reset_senha_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reset_senha
    ADD CONSTRAINT reset_senha_pkey PRIMARY KEY (id);


--
-- TOC entry 4791 (class 2606 OID 16429)
-- Name: reset_senha reset_senha_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reset_senha
    ADD CONSTRAINT reset_senha_token_key UNIQUE (token);


--
-- TOC entry 4793 (class 2606 OID 16444)
-- Name: token_verificacao_email token_verificacao_email_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token_verificacao_email
    ADD CONSTRAINT token_verificacao_email_pkey PRIMARY KEY (id);


--
-- TOC entry 4795 (class 2606 OID 16446)
-- Name: token_verificacao_email token_verificacao_email_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token_verificacao_email
    ADD CONSTRAINT token_verificacao_email_token_key UNIQUE (token);


--
-- TOC entry 4781 (class 2606 OID 16398)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4783 (class 2606 OID 16400)
-- Name: usuarios usuarios_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_username_key UNIQUE (username);


--
-- TOC entry 4799 (class 2606 OID 16430)
-- Name: reset_senha fk_credenciais; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reset_senha
    ADD CONSTRAINT fk_credenciais FOREIGN KEY (credenciais_id) REFERENCES public.credenciais(id) ON DELETE CASCADE;


--
-- TOC entry 4798 (class 2606 OID 16413)
-- Name: credenciais fk_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credenciais
    ADD CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 4801 (class 2606 OID 16462)
-- Name: postagem fk_usuario_postagem; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postagem
    ADD CONSTRAINT fk_usuario_postagem FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 4800 (class 2606 OID 16447)
-- Name: token_verificacao_email fk_usuario_token; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token_verificacao_email
    ADD CONSTRAINT fk_usuario_token FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


-- Completed on 2026-03-14 01:08:28

--
-- PostgreSQL database dump complete
--

\unrestrict NkcH4wNg7ktylWw7osPwljo3wfLvPdlMqU5mkAmgI3z9UGe27pojgw1kg8PNgYf

