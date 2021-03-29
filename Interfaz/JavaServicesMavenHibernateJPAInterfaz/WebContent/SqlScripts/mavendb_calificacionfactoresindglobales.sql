-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: mavendb
-- ------------------------------------------------------
-- Server version	5.7.18-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `calificacionfactoresindglobales`
--

DROP TABLE IF EXISTS `calificacionfactoresindglobales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `calificacionfactoresindglobales` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `EscalabilidadDinamica` float DEFAULT NULL,
  `Manejabilidad` float DEFAULT NULL,
  `UtilizacionRecursos` float DEFAULT NULL,
  `Disponibilidad` float DEFAULT NULL,
  `Fiabilidad` float DEFAULT NULL,
  `IntegracionContinua` float DEFAULT NULL,
  `Modularidad` float DEFAULT NULL,
  `Mantenibilidad` float DEFAULT NULL,
  `Reusabilidad` float DEFAULT NULL,
  `Flexibilidad` float DEFAULT NULL,
  `InterOperabilidad` float DEFAULT NULL,
  `CohesionAcoplamiento` float DEFAULT NULL,
  `Portabilidad` float DEFAULT NULL,
  `ComputacionNube` float DEFAULT NULL,
  `PorcentajeRecomendacion` float DEFAULT NULL,
  `RecomendacionFinal` varchar(200) DEFAULT NULL,
  `EscalabilidadDinamicaSI` tinyint(4) DEFAULT NULL,
  `ManejabilidadSi` tinyint(4) DEFAULT NULL,
  `UtilizacionRecursosSi` tinyint(4) DEFAULT NULL,
  `DisponibilidadSi` tinyint(4) DEFAULT NULL,
  `FiabilidadSi` tinyint(4) DEFAULT NULL,
  `IntegracionContinuaSi` tinyint(4) DEFAULT NULL,
  `MantenibilidadSi` tinyint(4) DEFAULT NULL,
  `ReusabilidadSi` tinyint(4) DEFAULT NULL,
  `FlexibilidadSi` tinyint(4) DEFAULT NULL,
  `InterOperabilidadSi` tinyint(4) DEFAULT NULL,
  `CohesionAcoplamientoSi` tinyint(4) DEFAULT NULL,
  `PortabilidadSi` tinyint(4) DEFAULT NULL,
  `ComputacionNubeSi` tinyint(4) DEFAULT NULL,
  `PorcentajeRecomendacionSi` tinyint(4) DEFAULT NULL,
  `ModularidadSi` tinyint(4) DEFAULT NULL,
  `idProyecto` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-03-29 10:49:57
