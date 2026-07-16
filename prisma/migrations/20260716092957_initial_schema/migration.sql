-- CreateTable
CREATE TABLE "Empresa" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT,
    "telefono" TEXT,
    "whatsappInstanceId" TEXT,
    "estado" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationSession" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'BOT_ACTIVE',
    "ultimaIntervencionHumana" TIMESTAMP(3),
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConversationSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageBuffer" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "mensajes" JSONB NOT NULL DEFAULT '[]',
    "estado" TEXT NOT NULL DEFAULT 'COLLECTING',
    "ventanaMs" INTEGER NOT NULL DEFAULT 3000,
    "maxMensajes" INTEGER NOT NULL DEFAULT 10,
    "expiraEn" TIMESTAMP(3) NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessageBuffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationFlow" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "etapa" TEXT NOT NULL,
    "etapaAnterior" TEXT,
    "contexto" JSONB NOT NULL DEFAULT '{}',
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConversationFlow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutboundMessage" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "conversationId" TEXT,
    "clienteId" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'TEXT',
    "estado" TEXT NOT NULL DEFAULT 'PENDING',
    "intentos" INTEGER NOT NULL DEFAULT 0,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enviadoEn" TIMESTAMP(3),

    CONSTRAINT "OutboundMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Usuario_empresaId_idx" ON "Usuario"("empresaId");

-- CreateIndex
CREATE INDEX "Usuario_email_idx" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "ConversationSession_empresaId_idx" ON "ConversationSession"("empresaId");

-- CreateIndex
CREATE INDEX "ConversationSession_clienteId_idx" ON "ConversationSession"("clienteId");

-- CreateIndex
CREATE INDEX "ConversationSession_empresaId_clienteId_idx" ON "ConversationSession"("empresaId", "clienteId");

-- CreateIndex
CREATE INDEX "MessageBuffer_empresaId_idx" ON "MessageBuffer"("empresaId");

-- CreateIndex
CREATE INDEX "MessageBuffer_conversationId_idx" ON "MessageBuffer"("conversationId");

-- CreateIndex
CREATE INDEX "MessageBuffer_estado_expiraEn_idx" ON "MessageBuffer"("estado", "expiraEn");

-- CreateIndex
CREATE INDEX "ConversationFlow_empresaId_idx" ON "ConversationFlow"("empresaId");

-- CreateIndex
CREATE INDEX "ConversationFlow_conversationId_idx" ON "ConversationFlow"("conversationId");

-- CreateIndex
CREATE INDEX "OutboundMessage_empresaId_idx" ON "OutboundMessage"("empresaId");

-- CreateIndex
CREATE INDEX "OutboundMessage_estado_idx" ON "OutboundMessage"("estado");
