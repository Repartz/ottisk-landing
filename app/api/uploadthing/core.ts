// ============================================
// UPLOADTHING v7: Конфигурация загрузчика файлов
// Роут: /api/uploadthing
// Разрешены: изображения до 8 МБ, макс 10 файлов за раз
// Доступно только из админки (проверяем cookie)
// ============================================

import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { cookies } from 'next/headers';

const f = createUploadthing();

export const ourFileRouter = {
  portfolioImages: f({
    image: { maxFileSize: '8MB', maxFileCount: 10 },
  })
    .middleware(async () => {
      const cookieStore = await cookies();
      const session = cookieStore.get('admin_session');
      if (!session?.value) {
        throw new UploadThingError('Unauthorized');
      }
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl ?? file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
