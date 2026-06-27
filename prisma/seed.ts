import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Crear usuario ADMIN
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@sistema.com' },
    update: {},
    create: {
      nombre: 'Administrador',
      email: 'admin@sistema.com',
      password: adminPassword,
      rol: 'ADMIN',
      estado: true
    }
  });

  console.log('✅ Usuario ADMIN creado');

  // Crear campaña
  const campania = await prisma.campania.create({
    data: {
      nombre: 'Campaña Electoral 2026',
      descripcion: 'Campaña de seguimiento y escrutinio',
      fechaInicio: new Date('2026-01-01'),
      fechaFin: new Date('2026-12-31'),
      esActiva: true
    }
  });

  console.log('✅ Campaña creada');

  // Crear territorios
  const region = await prisma.territorio.create({
    data: {
      nombre: 'Lima',
      tipo: 'REGION'
    }
  });

  const provincia = await prisma.territorio.create({
    data: {
      nombre: 'Lima',
      tipo: 'PROVINCIA',
      parentId: region.id
    }
  });

  const distrito = await prisma.territorio.create({
    data: {
      nombre: 'Miraflores',
      tipo: 'DISTRITO',
      parentId: provincia.id
    }
  });

  console.log('✅ Territorios creados');

  // Crear candidatos
  const candidato1 = await prisma.candidato.create({
    data: {
      nombre: 'Juan Pérez',
      partido: 'Partido A',
      esPrincipal: true,
      campaniaId: campania.id
    }
  });

  const candidato2 = await prisma.candidato.create({
    data: {
      nombre: 'María García',
      partido: 'Partido B',
      esPrincipal: false,
      campaniaId: campania.id
    }
  });

  console.log('✅ Candidatos creados');

  // Crear ciudadano
  const ciudadano = await prisma.ciudadano.create({
    data: {
      dni: '12345678',
      nombres: 'Carlos',
      apellidos: 'Mendoza',
      celular: '999888777',
      sectorId: distrito.id
    }
  });

  console.log('✅ Ciudadanos creados');

  // Crear seguimiento
  await prisma.seguimiento.create({
    data: {
      ciudadanoId: ciudadano.id,
      campaniaId: campania.id,
      estado: 'APOYA',
      nivelConfianza: 'ALTO',
      usuarioId: admin.id,
      fechaContacto: new Date()
    }
  });

  console.log('✅ Seguimiento creado');

  console.log('🎉 Seed completado');
  console.log(`📧 Admin: ${admin.email}`);
  console.log(`🔑 Password: admin123`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });