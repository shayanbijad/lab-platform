--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: MissionStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MissionStatus" AS ENUM (
    'PENDING',
    'ASSIGNED',
    'COLLECTED',
    'CANCELLED'
);


ALTER TYPE public."MissionStatus" OWNER TO postgres;

--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'CREATED',
    'SCHEDULED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public."OrderStatus" OWNER TO postgres;

--
-- Name: TestStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TestStatus" AS ENUM (
    'PENDING',
    'COLLECTED',
    'PROCESSING',
    'COMPLETED'
);


ALTER TYPE public."TestStatus" OWNER TO postgres;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserRole" AS ENUM (
    'PATIENT',
    'SAMPLER',
    'LAB_ADMIN',
    'SUPER_ADMIN'
);


ALTER TYPE public."UserRole" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Address" (
    id text NOT NULL,
    "patientId" text NOT NULL,
    city text NOT NULL,
    street text NOT NULL,
    building text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    label text,
    latitude double precision,
    longitude double precision,
    unit text
);


ALTER TABLE public."Address" OWNER TO postgres;

--
-- Name: Doctor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Doctor" (
    id integer NOT NULL,
    name text NOT NULL,
    "Categories" text NOT NULL,
    "Experience" integer NOT NULL,
    "Address" text NOT NULL,
    image text NOT NULL
);


ALTER TABLE public."Doctor" OWNER TO postgres;

--
-- Name: Doctor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Doctor_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Doctor_id_seq" OWNER TO postgres;

--
-- Name: Doctor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Doctor_id_seq" OWNED BY public."Doctor".id;


--
-- Name: Lab; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Lab" (
    id text NOT NULL,
    name text NOT NULL,
    address text NOT NULL,
    phone text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Lab" OWNER TO postgres;

--
-- Name: LabTest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LabTest" (
    id text NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    description text,
    price double precision NOT NULL,
    category text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."LabTest" OWNER TO postgres;

--
-- Name: Order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Order" (
    id text NOT NULL,
    "patientId" text NOT NULL,
    "labId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "addressId" text,
    "completedAt" timestamp(3) without time zone,
    "scheduledAt" timestamp(3) without time zone,
    status public."OrderStatus" DEFAULT 'CREATED'::public."OrderStatus" NOT NULL
);


ALTER TABLE public."Order" OWNER TO postgres;

--
-- Name: OrderTest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrderTest" (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "testId" text NOT NULL,
    status public."TestStatus" DEFAULT 'PENDING'::public."TestStatus" NOT NULL
);


ALTER TABLE public."OrderTest" OWNER TO postgres;

--
-- Name: Patient; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Patient" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    "nationalId" text NOT NULL,
    "birthDate" timestamp(3) without time zone NOT NULL,
    gender text NOT NULL,
    "insuranceId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Patient" OWNER TO postgres;

--
-- Name: Result; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Result" (
    id text NOT NULL,
    "orderTestId" text NOT NULL,
    value text NOT NULL,
    unit text,
    reference text,
    remarks text,
    reviewed boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Result" OWNER TO postgres;

--
-- Name: Sampler; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Sampler" (
    id text NOT NULL,
    "userId" text NOT NULL
);


ALTER TABLE public."Sampler" OWNER TO postgres;

--
-- Name: SamplerMission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SamplerMission" (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "samplerId" text,
    status public."MissionStatus" DEFAULT 'PENDING'::public."MissionStatus" NOT NULL,
    "scheduledAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "addressId" text NOT NULL,
    "collectedAt" timestamp(3) without time zone
);


ALTER TABLE public."SamplerMission" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    phone text NOT NULL,
    email text,
    password text NOT NULL,
    role public."UserRole" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Doctor id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Doctor" ALTER COLUMN id SET DEFAULT nextval('public."Doctor_id_seq"'::regclass);


--
-- Data for Name: Address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Address" (id, "patientId", city, street, building, "createdAt", label, latitude, longitude, unit) FROM stdin;
38de2f92-aca5-4620-8ff8-b833d48b655a	2b0965b6-511b-41b8-b23d-e29579e94552	Unknown	Unknown	Unknown	2026-03-29 11:17:28.142	Home	\N	\N	\N
\.


--
-- Data for Name: Doctor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Doctor" (id, name, "Categories", "Experience", "Address", image) FROM stdin;
1	دکتر علی رضایی	متخصص قلب	12	تهران	/images/doctors/01.jpg
2	دکتر مریم صادقی	متخصص مغز و اعصاب	9	شیراز	/images/doctors/02.jpg
3	دکتر حمیدرضا مرادی	متخصص ارتوپدی	15	اصفهان	/images/doctors/03.jpg
4	دکتر سارا احمدی	فوق تخصص گوارش	7	تبریز	/images/doctors/04.jpg
5	دکتر محمد خسروی	متخصص اطفال	11	کرج	/images/doctors/05.jpg
6	دکتر نرگس شریعتی	متخصص زنان و زایمان	10	مشهد	/images/doctors/06.jpg
7	دکتر وحید عزیزی	فوق تخصص روماتولوژی	13	تهران	/images/doctors/07.jpg
\.


--
-- Data for Name: Lab; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Lab" (id, name, address, phone, "createdAt") FROM stdin;
\.


--
-- Data for Name: LabTest; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LabTest" (id, name, code, description, price, category, "createdAt") FROM stdin;
c521fc7c-5865-4274-a566-1508140280e3	CBC	CBC	\N	25	Hematology	2026-03-27 11:03:31.49
4b0a8f92-b5ff-4d8f-bc3d-20210c088ca9	Blood Glucose	GLU	\N	15	Biochemistry	2026-03-27 11:03:31.49
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Order" (id, "patientId", "labId", "createdAt", "addressId", "completedAt", "scheduledAt", status) FROM stdin;
114d991d-7b0f-465a-83ce-ecc8600bded0	2b0965b6-511b-41b8-b23d-e29579e94552	\N	2026-03-29 11:17:28.169	38de2f92-aca5-4620-8ff8-b833d48b655a	\N	\N	CREATED
11bfa504-f6e0-449c-8594-c293417423cc	2b0965b6-511b-41b8-b23d-e29579e94552	\N	2026-03-29 14:59:46.967	38de2f92-aca5-4620-8ff8-b833d48b655a	\N	\N	CREATED
7fb7ecfe-8505-458b-beda-f541c428d6ef	2b0965b6-511b-41b8-b23d-e29579e94552	\N	2026-03-29 15:42:01.456	38de2f92-aca5-4620-8ff8-b833d48b655a	\N	\N	CREATED
\.


--
-- Data for Name: OrderTest; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrderTest" (id, "orderId", "testId", status) FROM stdin;
d271a717-dc5e-4647-8809-739c36e42baa	114d991d-7b0f-465a-83ce-ecc8600bded0	c521fc7c-5865-4274-a566-1508140280e3	PENDING
41ed51dc-b18e-450e-972c-bf4bf2465acc	114d991d-7b0f-465a-83ce-ecc8600bded0	4b0a8f92-b5ff-4d8f-bc3d-20210c088ca9	PENDING
41c4c4be-9384-459d-b934-3aac57b22615	11bfa504-f6e0-449c-8594-c293417423cc	4b0a8f92-b5ff-4d8f-bc3d-20210c088ca9	PENDING
da6d2c74-ea90-4517-bb09-9f68b0dd41c4	11bfa504-f6e0-449c-8594-c293417423cc	c521fc7c-5865-4274-a566-1508140280e3	PENDING
cdb784d6-eb69-4a38-b94a-763b462c6743	7fb7ecfe-8505-458b-beda-f541c428d6ef	c521fc7c-5865-4274-a566-1508140280e3	PENDING
\.


--
-- Data for Name: Patient; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Patient" (id, "userId", "firstName", "lastName", "nationalId", "birthDate", gender, "insuranceId", "createdAt") FROM stdin;
2b0965b6-511b-41b8-b23d-e29579e94552	38d13a4f-f55d-487e-95a9-f88befc484b6	Patient	38d13a4f	temp_38d13a4f-f55d-487e-95a9-f88befc484b6	2026-03-29 11:17:28.091	male	\N	2026-03-29 11:17:28.105
\.


--
-- Data for Name: Result; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Result" (id, "orderTestId", value, unit, reference, remarks, reviewed, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Sampler; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Sampler" (id, "userId") FROM stdin;
89ee40b4-d0e1-406c-9a66-96f243394368	3f91335e-4821-4a2d-9301-60b53c9c8735
\.


--
-- Data for Name: SamplerMission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SamplerMission" (id, "orderId", "samplerId", status, "scheduledAt", "createdAt", "addressId", "collectedAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, phone, email, password, role, "createdAt", "updatedAt") FROM stdin;
183aaf3c-477a-4e89-8dfb-46d69ef40618	+1234567890	admin@lab.com	$2b$10$/H4ep5dVCNzxggko2qrs2OJ/Z3Z0cdyBq/qsqGxgrLLGgzIBdAzFq	SUPER_ADMIN	2026-03-28 14:40:59.989	2026-03-28 14:57:32.781
38d13a4f-f55d-487e-95a9-f88befc484b6	09902608575	respshy@gmail.com	$2b$10$nXHsb0mWvpY.ASAL6/W/w.h/xD.Os8h4t7HF8DavXIvu7LQTgJI2u	PATIENT	2026-03-29 07:16:20.738	2026-03-29 07:16:20.738
3f91335e-4821-4a2d-9301-60b53c9c8735	09981080805	shayanmilthis@gmail.com	$2b$10$Mg.sp8By38d9KmDipceniu4XXsIgk9OgX/p76jLLLUytihfmFGHU6	SAMPLER	2026-03-29 07:53:10.501	2026-03-29 07:53:10.501
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
626968d7-a258-40dd-8924-2cec9aa913fd	31d8310c00b616f4e36dc81d3c5be76f1875f8fba7e21f852343294fd61d69cf	2026-03-24 15:08:19.486782+03:30	20260324113819_lab_results	\N	\N	2026-03-24 15:08:19.283931+03:30	1
cd39b9ae-1a14-41d0-9348-49716b7346c0	53d485a3ef36bd841b7d8fdd282038e0257aba4666fd9e86b439b56ad096a8e1	2026-03-27 13:55:15.466026+03:30	20260327102515_update_order_status	\N	\N	2026-03-27 13:55:15.319188+03:30	1
f40cf6c6-89a5-44e6-98ed-6a6192772ae4	5f3cdcf400911619f306db005a93f18e366652f7a2b6f86b283bc1db6da789aa	2026-03-27 20:52:29.917484+03:30	20260327172229_add_doctors	\N	\N	2026-03-27 20:52:29.89145+03:30	1
\.


--
-- Name: Doctor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Doctor_id_seq"', 7, true);


--
-- Name: Address Address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Address"
    ADD CONSTRAINT "Address_pkey" PRIMARY KEY (id);


--
-- Name: Doctor Doctor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Doctor"
    ADD CONSTRAINT "Doctor_pkey" PRIMARY KEY (id);


--
-- Name: LabTest LabTest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LabTest"
    ADD CONSTRAINT "LabTest_pkey" PRIMARY KEY (id);


--
-- Name: Lab Lab_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Lab"
    ADD CONSTRAINT "Lab_pkey" PRIMARY KEY (id);


--
-- Name: OrderTest OrderTest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderTest"
    ADD CONSTRAINT "OrderTest_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: Patient Patient_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Patient"
    ADD CONSTRAINT "Patient_pkey" PRIMARY KEY (id);


--
-- Name: Result Result_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Result"
    ADD CONSTRAINT "Result_pkey" PRIMARY KEY (id);


--
-- Name: SamplerMission SamplerMission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SamplerMission"
    ADD CONSTRAINT "SamplerMission_pkey" PRIMARY KEY (id);


--
-- Name: Sampler Sampler_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Sampler"
    ADD CONSTRAINT "Sampler_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: LabTest_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "LabTest_code_key" ON public."LabTest" USING btree (code);


--
-- Name: OrderTest_orderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "OrderTest_orderId_idx" ON public."OrderTest" USING btree ("orderId");


--
-- Name: Order_patientId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Order_patientId_idx" ON public."Order" USING btree ("patientId");


--
-- Name: Patient_nationalId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Patient_nationalId_key" ON public."Patient" USING btree ("nationalId");


--
-- Name: Patient_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Patient_userId_key" ON public."Patient" USING btree ("userId");


--
-- Name: Result_orderTestId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Result_orderTestId_key" ON public."Result" USING btree ("orderTestId");


--
-- Name: SamplerMission_samplerId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SamplerMission_samplerId_idx" ON public."SamplerMission" USING btree ("samplerId");


--
-- Name: Sampler_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Sampler_userId_key" ON public."Sampler" USING btree ("userId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_phone_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_phone_key" ON public."User" USING btree (phone);


--
-- Name: Address Address_patientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Address"
    ADD CONSTRAINT "Address_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES public."Patient"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: OrderTest OrderTest_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderTest"
    ADD CONSTRAINT "OrderTest_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: OrderTest OrderTest_testId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderTest"
    ADD CONSTRAINT "OrderTest_testId_fkey" FOREIGN KEY ("testId") REFERENCES public."LabTest"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Order Order_addressId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES public."Address"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Order Order_labId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_labId_fkey" FOREIGN KEY ("labId") REFERENCES public."Lab"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Order Order_patientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES public."Patient"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Patient Patient_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Patient"
    ADD CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Result Result_orderTestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Result"
    ADD CONSTRAINT "Result_orderTestId_fkey" FOREIGN KEY ("orderTestId") REFERENCES public."OrderTest"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SamplerMission SamplerMission_addressId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SamplerMission"
    ADD CONSTRAINT "SamplerMission_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES public."Address"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SamplerMission SamplerMission_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SamplerMission"
    ADD CONSTRAINT "SamplerMission_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SamplerMission SamplerMission_samplerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SamplerMission"
    ADD CONSTRAINT "SamplerMission_samplerId_fkey" FOREIGN KEY ("samplerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Sampler Sampler_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Sampler"
    ADD CONSTRAINT "Sampler_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

