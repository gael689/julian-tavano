-- ============================================================================
-- Seed: datos actuales del sitio (generado por scripts/generate-seed.mjs).
-- Idempotente: se puede correr más de una vez sin duplicar.
-- ============================================================================

-- Prototipos ----------------------------------------------------------------
insert into public.prototipos (slug, type, name, tagline_es, tagline_en, description_es, description_en, covered_area, semi_covered_area, bedrooms, bathrooms, features_es, features_en, sort_order)
values ('casa-cardon', 'casa', 'Cardón', 'Armonía. Simpleza. Esencial.', 'Harmony. Simplicity. Essential.', 'Un espacio integrado que combina diseño y funcionalidad para ofrecerte todo lo que necesitás, en un ambiente cálido y en conexión con la naturaleza.', 'An integrated space that combines design and functionality to give you everything you need, in a warm environment connected to nature.', 25, null, 1, 1, 'Cocina, comedor y dormitorio integrados · Espacio exterior para disfrutar el entorno', 'Kitchen, dining and bedroom integrated · Outdoor space to enjoy the surroundings', 0)
on conflict (slug) do nothing;

insert into public.prototipos (slug, type, name, tagline_es, tagline_en, description_es, description_en, covered_area, semi_covered_area, bedrooms, bathrooms, features_es, features_en, sort_order)
values ('cabana-norte', 'cabaña', 'Norte', 'Simple. Cálida. Funcional.', 'Simple. Warm. Functional.', 'Un refugio íntimo y eficiente diseñado para disfrutar la naturaleza sin renunciar al confort. Cada espacio está pensado para que te sientas en casa, donde sea que estés.', 'An intimate and efficient refuge designed to enjoy nature without giving up comfort. Every space is crafted so you feel at home, wherever you are.', 30, null, 1, 1, 'Cocina, estar-comedor integrados · Espacio exterior para disfrutar el entorno', 'Kitchen and living-dining area integrated · Outdoor space to enjoy the surroundings', 1)
on conflict (slug) do nothing;

insert into public.prototipos (slug, type, name, tagline_es, tagline_en, description_es, description_en, covered_area, semi_covered_area, bedrooms, bathrooms, features_es, features_en, sort_order)
values ('cabana-brote', 'cabaña', 'Brote', 'Simple. Natural. Esencial.', 'Simple. Natural. Essential.', 'Cabaña compacta y funcional, diseñada para disfrutar la naturaleza con comodidad y estilo. Luz, calidez y conexión en cada rincón.', 'Compact and functional cabin, designed to enjoy nature with comfort and style. Light, warmth and connection in every corner.', 35, 13, 1, 1, 'Living-comedor y cocina integrados', 'Living-dining room and kitchen integrated', 2)
on conflict (slug) do nothing;

insert into public.prototipos (slug, type, name, tagline_es, tagline_en, description_es, description_en, covered_area, semi_covered_area, bedrooms, bathrooms, features_es, features_en, sort_order)
values ('casa-coral', 'casa', 'Coral', 'Vida costera. Confort natural.', 'Coastal living. Natural comfort.', 'Diseñada para disfrutar la luz, la brisa y la tranquilidad. Espacios amplios e integrados que invitan a compartir y relajarse, en perfecta armonía con el entorno natural.', 'Designed to enjoy the light, the breeze and the tranquility. Spacious, integrated spaces that invite sharing and relaxing in perfect harmony with the natural surroundings.', 50, null, 2, 1, 'Cocina y comedor integrados · Estar integrado · Ideal para entornos costeros o de playa', 'Kitchen and dining room integrated · Living area integrated · Ideal for coastal or beach settings', 3)
on conflict (slug) do nothing;

insert into public.prototipos (slug, type, name, tagline_es, tagline_en, description_es, description_en, covered_area, semi_covered_area, bedrooms, bathrooms, features_es, features_en, sort_order)
values ('cabana-coihue', 'cabaña', 'Coihue', 'Amplia. Cálida. Funcional.', 'Spacious. Warm. Functional.', 'Diseñada para conectar con el entorno y compartir momentos inolvidables. Espacios amplios, luz natural y una galería con parrilla para disfrutar todo el año.', 'Designed to connect with the surroundings and share unforgettable moments. Spacious areas, natural light and a gallery with BBQ to enjoy all year round.', 55, 25, 2, 1, 'Estar-comedor y cocina integrados · Parrilla en semicubierto', 'Living-dining room and kitchen integrated · BBQ in the semi-covered area', 4)
on conflict (slug) do nothing;

insert into public.prototipos (slug, type, name, tagline_es, tagline_en, description_es, description_en, covered_area, semi_covered_area, bedrooms, bathrooms, features_es, features_en, sort_order)
values ('casa-jarilla', 'casa', 'Jarilla', 'Amplitud. Diseño. Naturaleza.', 'Space. Design. Nature.', 'Una casa pensada para vivir momentos inolvidables, con espacios amplios y luminosos que se integran con el entorno. Ideal para disfrutar en familia o con amigos, todo el año.', 'A house designed for unforgettable moments, with spacious and luminous spaces that blend with the surroundings. Perfect for family gatherings or friends, all year round.', 80, null, 2, 1, 'Cocina y comedor integrados · Estar integrado · Gran deck de expansión', 'Kitchen and dining room integrated · Living area integrated · Large expansion deck', 5)
on conflict (slug) do nothing;

-- Imágenes de prototipos ----------------------------------------------------
insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/casa-cardon/imagenes/01.jpg', 'Casa Cardón — exterior nocturno con deck en entorno de pinos', 'Exterior', 0 from public.prototipos where slug = 'casa-cardon'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'casa-cardon' and pi.src = '/prototipos/casa-cardon/imagenes/01.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/casa-cardon/imagenes/02.jpg', 'Casa Cardón — ambiente integrado con dormitorio y cocina', 'Ambiente integrado', 1 from public.prototipos where slug = 'casa-cardon'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'casa-cardon' and pi.src = '/prototipos/casa-cardon/imagenes/02.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/casa-cardon/imagenes/03.jpg', 'Casa Cardón — dormitorio con ventana circular al bosque', 'Dormitorio', 2 from public.prototipos where slug = 'casa-cardon'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'casa-cardon' and pi.src = '/prototipos/casa-cardon/imagenes/03.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/casa-cardon/imagenes/04.jpg', 'Casa Cardón — cocina con barra y detalles en madera', 'Cocina', 3 from public.prototipos where slug = 'casa-cardon'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'casa-cardon' and pi.src = '/prototipos/casa-cardon/imagenes/04.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/casa-cardon/imagenes/05.jpg', 'Casa Cardón — baño completo con ducha y espejo circular', 'Baño', 4 from public.prototipos where slug = 'casa-cardon'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'casa-cardon' and pi.src = '/prototipos/casa-cardon/imagenes/05.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/casa-cardon/imagenes/06.jpg', 'Casa Cardón — planta aérea con deck y distribución', 'Planta', 5 from public.prototipos where slug = 'casa-cardon'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'casa-cardon' and pi.src = '/prototipos/casa-cardon/imagenes/06.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/casa-cardon/imagenes/07.jpg', 'Casa Cardón — exterior diurno en entorno de dunas y pinos', 'Exterior', 6 from public.prototipos where slug = 'casa-cardon'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'casa-cardon' and pi.src = '/prototipos/casa-cardon/imagenes/07.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/cabana-norte/imagenes/01.jpg', 'Cabaña Norte — exterior con deck en entorno natural', 'Exterior', 0 from public.prototipos where slug = 'cabana-norte'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'cabana-norte' and pi.src = '/prototipos/cabana-norte/imagenes/01.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/cabana-norte/imagenes/02.jpg', 'Cabaña Norte — interior con luz natural', 'Interior', 1 from public.prototipos where slug = 'cabana-norte'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'cabana-norte' and pi.src = '/prototipos/cabana-norte/imagenes/02.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/cabana-norte/imagenes/03.jpg', 'Cabaña Norte — cocina integrada', 'Cocina', 2 from public.prototipos where slug = 'cabana-norte'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'cabana-norte' and pi.src = '/prototipos/cabana-norte/imagenes/03.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/cabana-norte/imagenes/04.jpg', 'Cabaña Norte — habitación principal', 'Habitación', 3 from public.prototipos where slug = 'cabana-norte'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'cabana-norte' and pi.src = '/prototipos/cabana-norte/imagenes/04.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/cabana-norte/imagenes/05.jpg', 'Cabaña Norte — baño completo', 'Baño', 4 from public.prototipos where slug = 'cabana-norte'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'cabana-norte' and pi.src = '/prototipos/cabana-norte/imagenes/05.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/cabana-norte/imagenes/06.jpg', 'Cabaña Norte — espacio exterior', 'Exterior', 5 from public.prototipos where slug = 'cabana-norte'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'cabana-norte' and pi.src = '/prototipos/cabana-norte/imagenes/06.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/cabana-norte/imagenes/07.jpg', 'Cabaña Norte — planta de distribución', 'Planta', 6 from public.prototipos where slug = 'cabana-norte'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'cabana-norte' and pi.src = '/prototipos/cabana-norte/imagenes/07.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/cabana-brote/imagenes/01.jpg', 'Cabaña Brote — exterior con deck y entorno natural', 'Exterior', 0 from public.prototipos where slug = 'cabana-brote'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'cabana-brote' and pi.src = '/prototipos/cabana-brote/imagenes/01.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/cabana-brote/imagenes/02.jpg', 'Cabaña Brote — living-comedor con luz natural', 'Living · Comedor', 1 from public.prototipos where slug = 'cabana-brote'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'cabana-brote' and pi.src = '/prototipos/cabana-brote/imagenes/02.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/cabana-brote/imagenes/03.jpg', 'Cabaña Brote — interior con ventanales al bosque', 'Interior', 2 from public.prototipos where slug = 'cabana-brote'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'cabana-brote' and pi.src = '/prototipos/cabana-brote/imagenes/03.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/cabana-brote/imagenes/04.jpg', 'Cabaña Brote — habitación principal', 'Habitación', 3 from public.prototipos where slug = 'cabana-brote'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'cabana-brote' and pi.src = '/prototipos/cabana-brote/imagenes/04.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/cabana-brote/imagenes/05.jpg', 'Cabaña Brote — baño con terminaciones modernas', 'Baño', 4 from public.prototipos where slug = 'cabana-brote'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'cabana-brote' and pi.src = '/prototipos/cabana-brote/imagenes/05.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/cabana-brote/imagenes/06.jpg', 'Cabaña Brote — galería exterior', 'Galería', 5 from public.prototipos where slug = 'cabana-brote'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'cabana-brote' and pi.src = '/prototipos/cabana-brote/imagenes/06.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/cabana-brote/imagenes/07.jpg', 'Cabaña Brote — planta aérea de distribución', 'Planta', 6 from public.prototipos where slug = 'cabana-brote'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'cabana-brote' and pi.src = '/prototipos/cabana-brote/imagenes/07.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/casa-coral/imagenes/01.jpg', 'Casa Coral — exterior en entorno costero', 'Exterior', 0 from public.prototipos where slug = 'casa-coral'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'casa-coral' and pi.src = '/prototipos/casa-coral/imagenes/01.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/casa-coral/imagenes/02.jpg', 'Casa Coral — living integrado con luz natural', 'Living', 1 from public.prototipos where slug = 'casa-coral'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'casa-coral' and pi.src = '/prototipos/casa-coral/imagenes/02.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/casa-coral/imagenes/03.jpg', 'Casa Coral — cocina y comedor', 'Cocina · Comedor', 2 from public.prototipos where slug = 'casa-coral'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'casa-coral' and pi.src = '/prototipos/casa-coral/imagenes/03.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/casa-coral/imagenes/04.jpg', 'Casa Coral — habitación principal', 'Habitación 1', 3 from public.prototipos where slug = 'casa-coral'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'casa-coral' and pi.src = '/prototipos/casa-coral/imagenes/04.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/casa-coral/imagenes/05.jpg', 'Casa Coral — habitación secundaria', 'Habitación 2', 4 from public.prototipos where slug = 'casa-coral'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'casa-coral' and pi.src = '/prototipos/casa-coral/imagenes/05.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/casa-coral/imagenes/06.jpg', 'Casa Coral — baño completo', 'Baño', 5 from public.prototipos where slug = 'casa-coral'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'casa-coral' and pi.src = '/prototipos/casa-coral/imagenes/06.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/casa-coral/imagenes/07.jpg', 'Casa Coral — planta de distribución', 'Planta', 6 from public.prototipos where slug = 'casa-coral'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'casa-coral' and pi.src = '/prototipos/casa-coral/imagenes/07.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/cabana-coihue/imagenes/01.jpg', 'Cabaña Coihue — exterior con galería y parrilla', 'Exterior', 0 from public.prototipos where slug = 'cabana-coihue'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'cabana-coihue' and pi.src = '/prototipos/cabana-coihue/imagenes/01.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/cabana-coihue/imagenes/02.jpg', 'Cabaña Coihue — estar-comedor integrado', 'Estar · Comedor', 1 from public.prototipos where slug = 'cabana-coihue'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'cabana-coihue' and pi.src = '/prototipos/cabana-coihue/imagenes/02.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/cabana-coihue/imagenes/03.jpg', 'Cabaña Coihue — cocina con luz natural', 'Cocina', 2 from public.prototipos where slug = 'cabana-coihue'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'cabana-coihue' and pi.src = '/prototipos/cabana-coihue/imagenes/03.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/cabana-coihue/imagenes/04.jpg', 'Cabaña Coihue — habitación principal', 'Habitación 1', 3 from public.prototipos where slug = 'cabana-coihue'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'cabana-coihue' and pi.src = '/prototipos/cabana-coihue/imagenes/04.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/cabana-coihue/imagenes/05.jpg', 'Cabaña Coihue — habitación secundaria', 'Habitación 2', 4 from public.prototipos where slug = 'cabana-coihue'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'cabana-coihue' and pi.src = '/prototipos/cabana-coihue/imagenes/05.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/cabana-coihue/imagenes/06.jpg', 'Cabaña Coihue — planta de distribución', 'Planta', 5 from public.prototipos where slug = 'cabana-coihue'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'cabana-coihue' and pi.src = '/prototipos/cabana-coihue/imagenes/06.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/casa-jarilla/imagenes/01.jpg', 'Casa Jarilla — exterior con deck de expansión', 'Exterior', 0 from public.prototipos where slug = 'casa-jarilla'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'casa-jarilla' and pi.src = '/prototipos/casa-jarilla/imagenes/01.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/casa-jarilla/imagenes/02.jpg', 'Casa Jarilla — living integrado con luz natural', 'Living', 1 from public.prototipos where slug = 'casa-jarilla'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'casa-jarilla' and pi.src = '/prototipos/casa-jarilla/imagenes/02.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/casa-jarilla/imagenes/03.jpg', 'Casa Jarilla — cocina y comedor', 'Cocina · Comedor', 2 from public.prototipos where slug = 'casa-jarilla'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'casa-jarilla' and pi.src = '/prototipos/casa-jarilla/imagenes/03.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/casa-jarilla/imagenes/04.jpg', 'Casa Jarilla — habitación principal', 'Habitación 1', 3 from public.prototipos where slug = 'casa-jarilla'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'casa-jarilla' and pi.src = '/prototipos/casa-jarilla/imagenes/04.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/casa-jarilla/imagenes/05.jpg', 'Casa Jarilla — habitación secundaria', 'Habitación 2', 4 from public.prototipos where slug = 'casa-jarilla'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'casa-jarilla' and pi.src = '/prototipos/casa-jarilla/imagenes/05.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/casa-jarilla/imagenes/06.jpg', 'Casa Jarilla — baño completo', 'Baño', 5 from public.prototipos where slug = 'casa-jarilla'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'casa-jarilla' and pi.src = '/prototipos/casa-jarilla/imagenes/06.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/casa-jarilla/imagenes/07.jpg', 'Casa Jarilla — deck exterior y entorno', 'Deck', 6 from public.prototipos where slug = 'casa-jarilla'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'casa-jarilla' and pi.src = '/prototipos/casa-jarilla/imagenes/07.jpg');

insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)
select id, '/prototipos/casa-jarilla/imagenes/08.jpg', 'Casa Jarilla — planta de distribución', 'Planta', 7 from public.prototipos where slug = 'casa-jarilla'
and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = 'casa-jarilla' and pi.src = '/prototipos/casa-jarilla/imagenes/08.jpg');

-- Obras ---------------------------------------------------------------------
insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('cabana-dana', 'Cabaña Dana', 'Monte Hermoso', -38.984639, -61.314917, null, null, null, 'vivienda', 0)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('casa-nestor', 'Casa Néstor', 'Monte Hermoso', -38.985556, -61.281583, null, null, null, 'vivienda', 1)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('proyecto-parador', 'Proyecto Parador', 'Monte Hermoso', -38.98925, -61.277167, null, null, null, 'vivienda', 2)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('casa-agus-l', 'Casa Agus L.', 'Monte Hermoso', -38.992028, -61.188194, null, null, null, 'vivienda', 3)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('modulo-luci', 'Módulo Lucí', 'Monte Hermoso', -38.980639, -61.32075, null, null, null, 'vivienda', 4)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('alpina-liliana', 'Alpina Liliana', 'Monte Hermoso', -38.990583, -61.218472, null, null, null, 'vivienda', 5)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('alpina-liliana-2', 'Alpina Liliana', 'Monte Hermoso', -38.990639, -61.218472, null, null, null, 'vivienda', 6)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('casa-jose', 'Casa José', 'Balneario Sauce Grande', -38.993111, -61.218667, null, null, null, 'vivienda', 7)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('proyecto-oscar', 'Proyecto Oscar', 'Monte Hermoso', -38.989556, -61.238361, null, null, null, 'vivienda', 8)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('casa-marisa', 'Casa Marisa', 'Balneario Sauce Grande', -38.991861, -61.233028, null, null, null, 'vivienda', 9)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('proyecto-maria-jose', 'Proyecto María José', 'Monte Hermoso', -38.991944, -61.220972, null, null, null, 'vivienda', 10)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('alpinas-hugo', 'Alpinas Hugo', 'Balneario Sauce Grande', -38.993028, -61.209833, null, null, null, 'vivienda', 11)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('casa-juanjo', 'Casa Juanjo', 'Monte Hermoso', -38.996583, -61.195917, null, null, null, 'vivienda', 12)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('serafin', 'Serafín', 'Monte Hermoso', -38.983472, -61.286556, null, null, null, 'vivienda', 13)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('proyecto-casa-laurel', 'Proyecto Casa Laurel', 'Monte Hermoso', -38.975306, -61.294444, null, null, null, 'vivienda', 14)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('proyecto-chilena', 'Proyecto Chilena', 'Monte Hermoso', -38.981306, -61.280333, null, null, null, 'vivienda', 15)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('casa-silos', 'Casa Silos', 'Monte Hermoso', -38.976667, -61.293472, null, null, null, 'vivienda', 16)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('proyecto-martin', 'Proyecto Martín', 'Monte Hermoso', -38.980222, -61.315972, null, null, null, 'vivienda', 17)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('proyecto-petroquimicos', 'Proyecto Petroquímicos', 'Monte Hermoso', -38.982694, -61.325306, null, null, null, 'vivienda', 18)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('casa-pablo-c', 'Casa Pablo C.', 'Monte Hermoso', -38.982, -61.32875, null, null, null, 'vivienda', 19)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('obra-pablo', 'Obra Pablo', 'Monte Hermoso', -38.984278, -61.330028, null, null, null, 'vivienda', 20)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('casa-cristina', 'Casa Cristina', 'Monte Hermoso', -38.987056, -61.282944, null, null, null, 'vivienda', 21)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('obra-el-pato', 'Obra El Pato', 'Monte Hermoso', -38.983472, -61.272639, null, null, null, 'vivienda', 22)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('duplex-flamencos', 'Dúplex Flamencos', 'Monte Hermoso', -38.986583, -61.27525, null, null, null, 'vivienda', 23)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('casa-daniel-g', 'Casa Daniel G.', 'Monte Hermoso', -38.982472, -61.27975, null, null, null, 'vivienda', 24)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('casa-guille-y-facu', 'Casa Guille y Facu', 'Monte Hermoso', -38.986083, -61.279722, null, null, null, 'vivienda', 25)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('supermercado-chino', 'Supermercado Chino', 'Monte Hermoso', -38.986861, -61.298611, null, null, null, 'vivienda', 26)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('fachada-sansot', 'Fachada Sansot', 'Monte Hermoso', -38.984528, -61.285278, null, null, null, 'vivienda', 27)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('casa-oscar', 'Casa Oscar', 'Monte Hermoso', -38.980583, -61.312944, null, null, null, 'vivienda', 28)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('jordan', 'Jordan', 'Monte Hermoso', -38.994222, -61.193028, null, null, null, 'vivienda', 29)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('casa-ricar', 'Casa Ricar', 'Monte Hermoso', -38.9865, -61.324694, null, null, null, 'vivienda', 30)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('obra-zenobio', 'Obra Zenobio', 'Monte Hermoso', -38.996, -61.188556, null, null, null, 'vivienda', 31)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('benito', 'Benito', 'Monte Hermoso', -38.980361, -61.282083, null, null, null, 'vivienda', 32)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('obra-nora', 'Obra Nora', 'Monte Hermoso', -38.986889, -61.276889, null, null, null, 'vivienda', 33)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('obra-cesarin', 'Obra Cesarín', 'Balneario Sauce Grande', -38.992611, -61.232, null, null, null, 'vivienda', 34)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('obra-goya', 'Obra Goya', 'Monte Hermoso', -38.981528, -61.27375, null, null, null, 'vivienda', 35)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('casa-rafa', 'Casa Rafa', 'Monte Hermoso', -38.98375, -61.32375, null, null, null, 'vivienda', 36)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('casa-nelson', 'Casa Nelson', 'Monte Hermoso', -38.98275, -61.329083, null, null, null, 'vivienda', 37)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('casanova', 'CasaNova', 'Monte Hermoso', -38.981648, -61.28159, null, null, null, 'vivienda', 38)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('casa-amado', 'Casa Amado', 'Monte Hermoso', -38.985556, -61.321722, null, null, null, 'vivienda', 39)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('casa-gaston-lemus', 'Casa Gastón Lemus', 'Monte Hermoso', -38.99071, -61.2342, null, null, null, 'vivienda', 40)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('casa-patricio', 'Casa Patricio', 'Balneario Sauce Grande', -38.993417, -61.194361, null, null, null, 'vivienda', 41)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('casa-pepe', 'Casa Pepe', 'Monte Hermoso', -38.983861, -61.320056, null, null, null, 'vivienda', 42)
on conflict (slug) do nothing;

insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)
values ('casa-de-hormigon', 'Casa de Hormigón', 'Monte Hermoso', -38.98325, -61.270778, null, null, null, 'vivienda', 43)
on conflict (slug) do nothing;

-- Inversiones ---------------------------------------------------------------
insert into public.inversiones (slug, nombre, tipo, ubicacion, detalle, estado, entrega, pdf_url, sort_order)
values ('los-aromos', 'Los Aromos', 'Fideicomiso', 'Monte Hermoso', '6 duplex · 70 m² c/u · a 150 m de la playa', 'En desarrollo', 'Dic. 2026', '/inversiones/fideicomiso-los-aromos-2026.pdf', 0)
on conflict (slug) do nothing;
