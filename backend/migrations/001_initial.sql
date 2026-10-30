CREATE TABLE careers (name text PRIMARY KEY, active boolean NOT NULL DEFAULT true);
CREATE TABLE categories (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL UNIQUE, active boolean NOT NULL DEFAULT true);
INSERT INTO careers(name) VALUES ('Automotriz'),('Industrias Alimentarias'),('Mecatrónica');
INSERT INTO categories(name) VALUES ('Electrónica'),('Laboratorio'),('Libros'),('Herramientas');

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), email text NOT NULL UNIQUE CHECK (email=lower(email)),
  student_hash text NOT NULL UNIQUE, name text NOT NULL CHECK(length(name) BETWEEN 2 AND 80),
  password_hash text NOT NULL, career text NOT NULL REFERENCES careers(name), semester smallint NOT NULL CHECK(semester BETWEEN 1 AND 16),
  role text NOT NULL DEFAULT 'student' CHECK(role IN ('student','admin')), verified_at timestamptz,
  suspended boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE sessions (
  token_hash text PRIMARY KEY, user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX sessions_expiry_idx ON sessions(expires_at);
CREATE TABLE access_tokens (
  token_hash text PRIMARY KEY, user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  purpose text NOT NULL CHECK(purpose IN ('verify','reset')), expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX access_tokens_user_idx ON access_tokens(user_id,purpose);
CREATE TABLE listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), seller_id uuid NOT NULL REFERENCES users(id),
  category_id uuid NOT NULL REFERENCES categories(id), career text NOT NULL REFERENCES careers(name),
  title text NOT NULL CHECK(length(trim(title)) BETWEEN 8 AND 100),
  description text NOT NULL CHECK(length(trim(description)) BETWEEN 20 AND 1500),
  location text NOT NULL CHECK(length(trim(location)) BETWEEN 3 AND 120),
  modality text NOT NULL CHECK(modality IN ('sale','rental','exchange','donation')),
  condition text NOT NULL CHECK(condition IN ('new','like_new','good','fair')),
  price_cents integer NOT NULL CHECK(price_cents BETWEEN 0 AND 100000000),
  status text NOT NULL DEFAULT 'available' CHECK(status IN ('draft','available','reserved','sold','rented','exchanged','donated','cancelled')),
  deleted_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((modality IN ('sale','rental') AND price_cents>0) OR (modality IN ('exchange','donation') AND price_cents=0))
);
CREATE INDEX listings_catalog_idx ON listings(status,created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX listings_filter_idx ON listings(category_id,modality,career) WHERE deleted_at IS NULL;
CREATE INDEX listings_owner_idx ON listings(seller_id);
CREATE TABLE listing_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), owner_id uuid NOT NULL REFERENCES users(id),
  listing_id uuid REFERENCES listings(id), object_key text NOT NULL UNIQUE,
  mime_type text NOT NULL CHECK(mime_type='image/webp'), size integer NOT NULL CHECK(size>0),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX listing_images_listing_idx ON listing_images(listing_id);
CREATE TABLE favorites (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(user_id,listing_id)
);
CREATE TABLE conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), listing_id uuid NOT NULL REFERENCES listings(id),
  buyer_id uuid NOT NULL REFERENCES users(id), seller_id uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(listing_id,buyer_id), CHECK(buyer_id<>seller_id)
);
CREATE INDEX conversations_seller_idx ON conversations(seller_id);
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), conversation_id uuid NOT NULL REFERENCES conversations(id),
  sender_id uuid NOT NULL REFERENCES users(id), body text NOT NULL CHECK(length(trim(body)) BETWEEN 1 AND 2000),
  sent_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX messages_conversation_idx ON messages(conversation_id,sent_at,id);
CREATE TABLE operations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), listing_id uuid NOT NULL REFERENCES listings(id),
  requester_id uuid NOT NULL REFERENCES users(id), offered_listing_id uuid REFERENCES listings(id),
  type text NOT NULL CHECK(type IN ('sale','rental','exchange','donation')),
  status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','accepted','rejected','completed','cancelled','expired')),
  rental_start date, rental_end date, amount_cents integer NOT NULL CHECK(amount_cents>=0),
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK(type<>'rental' OR (rental_start IS NOT NULL AND rental_end IS NOT NULL AND rental_end>=rental_start)),
  CHECK(type<>'exchange' OR offered_listing_id IS NOT NULL), CHECK(listing_id<>offered_listing_id)
);
CREATE UNIQUE INDEX one_accepted_operation_idx ON operations(listing_id) WHERE status='accepted';
CREATE UNIQUE INDEX one_active_request_idx ON operations(listing_id,requester_id) WHERE status IN ('pending','accepted');
CREATE INDEX operations_requester_idx ON operations(requester_id,created_at DESC);
CREATE TABLE ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), operation_id uuid NOT NULL REFERENCES operations(id),
  author_id uuid NOT NULL REFERENCES users(id), target_id uuid NOT NULL REFERENCES users(id),
  score smallint NOT NULL CHECK(score BETWEEN 1 AND 5), comment text NOT NULL CHECK(length(trim(comment)) BETWEEN 5 AND 1000),
  created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(operation_id,author_id), CHECK(author_id<>target_id)
);
CREATE TABLE reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), reporter_id uuid NOT NULL REFERENCES users(id), listing_id uuid NOT NULL REFERENCES listings(id),
  reason text NOT NULL CHECK(reason IN ('spam','inappropriate','fraud','prohibited')),
  detail text NOT NULL CHECK(length(trim(detail)) BETWEEN 10 AND 1000),
  status text NOT NULL DEFAULT 'open' CHECK(status IN ('open','reviewing','resolved','dismissed')),
  resolution text, resolved_by uuid REFERENCES users(id), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX one_open_report_idx ON reports(reporter_id,listing_id) WHERE status IN ('open','reviewing');
CREATE TABLE audit_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, actor_id uuid REFERENCES users(id),
  action text NOT NULL, resource_id uuid, created_at timestamptz NOT NULL DEFAULT now()
);
