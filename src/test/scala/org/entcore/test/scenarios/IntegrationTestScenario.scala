package org.entcore.test.scenarios

import io.gatling.core.Predef._

object IntegrationTestScenario {

  val scn = scenario("Integration Test Scenario")
    .group("Import schools Scenario") {
    ImportScenario.scn
  }
    .group("Directory Scenario") {
    DirectoryScenario.scn
  }
    .group("App-registry Scenario") {
    AppRegistryScenario.scn
  }
    .group("Auth Scenario") {
    AuthScenario.scn
  }
    .group("Cas Scenario") {
    CasScenario.scn
  }
    .group("Timeline Scenario") {
    TimelineScenario.scn
  }
    .group("Communication Scenario") {
    CommunicationScenario.scn
  }
    .group("App-registry ADML Scenario") {
    AppRegistryAdmlScenario.scn
  }
    .group("Directory ADML Scenario") {
    DirectoryAdmlScenario.scn
  }
    .group("Conversation Scenario") {
    ConversationScenario.scn
  }
    .group("Workspace Scenario") {
    WorkspaceScenario.scn
  }
    .group("Archive Scenario") {
    ArchiveScenario.scn
  }
    .group("Quota Scenario") {
    QuotaScenario.scn
  }
  .group("Actualites Scenario - main") {
    net.atos.entng.actualites.test.integration.ActualitesScenario.scn
  }
  .group("Actualites Scenario - shared no rights") {
    net.atos.entng.actualites.test.integration.ActualitesScenario.scnNoRights
  }
  .group("Actualites Scenario - shared read") {
    net.atos.entng.actualites.test.integration.ActualitesScenario.scnRead
  }
  .group("Actualites Scenario - shared comment") {
    net.atos.entng.actualites.test.integration.ActualitesScenario.scnComment
  }
  .group("Actualites Scenario - shared contrib") {
    net.atos.entng.actualites.test.integration.ActualitesScenario.scnContrib
  }
  .group("Actualites Scenario - shared publish") {
    net.atos.entng.actualites.test.integration.ActualitesScenario.scnPublish
  }
  .group("Actualites Scenario - shared manage") {
    net.atos.entng.actualites.test.integration.ActualitesScenario.scnManage
  }

  .group("Blog Scenario") {
      org.entcore.blog.test.integration.BlogScenario.scn
  }

.group("Community Scenario") {
  net.atos.entng.community.test.integration.CommunityScenario.scn
}

  .group("Forum Scenario - main") {
    net.atos.entng.forum.test.integration.ForumScenario.scn
  }
  .group("Forum Scenario - shared no rights") {
    net.atos.entng.forum.test.integration.ForumScenario.scnNoRights
  }
  .group("Forum Scenario - shared read") {
    net.atos.entng.forum.test.integration.ForumScenario.scnRead
  }
  .group("Forum Scenario - shared contrib") {
    net.atos.entng.forum.test.integration.ForumScenario.scnContrib
  }
  .group("Forum Scenario - shared moderate") {
    net.atos.entng.forum.test.integration.ForumScenario.scnModerate
  }
  .group("Forum Scenario - shared manager") {
    net.atos.entng.forum.test.integration.ForumScenario.scnManage
  }

//.group("Rack Scenario") {
//  fr.wseduc.rack.test.integration.RackScenario.scn
//}

  .group("Rbs Scenario") {
    net.atos.entng.rbs.test.integration.RbsScenario.scnCreateTeachers
  }
  .group("Rbs Scenario") {
    net.atos.entng.rbs.test.integration.RbsScenario.scnCreateBookings
  }

  .group("Wiki Scenario") {
    net.atos.entng.wiki.test.integration.WikiScenario.scn
  }
  .group("Wiki Scenario") {
    net.atos.entng.wiki.test.integration.WikiScenario.scnAccessNonSharedWiki
  }
  .group("Wiki Scenario") {
    net.atos.entng.wiki.test.integration.WikiScenario.scnAccessReadOnlyWiki
  }
  .group("Wiki Scenario") {
    net.atos.entng.wiki.test.integration.WikiScenario.scnContributeToWiki
  }
  .group("Wiki Scenario") {
    net.atos.entng.wiki.test.integration.WikiScenario.scnManageWikiAndCleanData
  }

}