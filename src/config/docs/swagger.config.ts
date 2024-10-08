import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export class SwaggerConfig {

    static config(app) {
        const config = new DocumentBuilder()
            .setTitle('Chat App API')
            .setDescription('App API')
            .setVersion('1.0')
            .addBearerAuth({
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            })
            .build();

        const document = SwaggerModule.createDocument(app, config);

        SwaggerModule.setup('api', app, document);
    }
}