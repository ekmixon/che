// /*********************************************************************
//  * Copyright (c) 2020 Red Hat, Inc.
//  *
//  * This program and the accompanying materials are made
//  * available under the terms of the Eclipse Public License 2.0
//  * which is available at https://www.eclipse.org/legal/epl-2.0/
//  *
//  * SPDX-License-Identifier: EPL-2.0
//  **********************************************************************/

import { e2eContainer } from '../../../inversify.config';
import { CLASSES, TYPES } from '../../../inversify.types';
import { TestConstants } from '../../../TestConstants';
import { ProjectAndFileTests } from '../../../testsLibrary/ProjectAndFileTests';
import CheReporter from '../../../driver/CheReporter';
import { BrowserTabsUtil } from '../../../utils/BrowserTabsUtil';
import { WorkspaceNameHandler } from '../../../utils/WorkspaceNameHandler';
import { TestWorkspaceUtil } from '../../../utils/workspace/TestWorkspaceUtil';

const projectAndFileTests: ProjectAndFileTests = e2eContainer.get(CLASSES.ProjectAndFileTests);
const browserTabsUtil: BrowserTabsUtil = e2eContainer.get(CLASSES.BrowserTabsUtil);
const workspaceNameHandler: WorkspaceNameHandler = e2eContainer.get(CLASSES.WorkspaceNameHandler);
const testWorkspaceUtils: TestWorkspaceUtil = e2eContainer.get<TestWorkspaceUtil>(TYPES.WorkspaceUtil);

const factoryUrl : string = `${TestConstants.TS_SELENIUM_BASE_URL}/f?url=https://github.com/che-samples/console-java-simple`;
const workspaceSampleName: string = 'console-java-simple';
const workspaceRootFolderName: string = 'src';
const fileFolderPath: string = `${workspaceSampleName}/${workspaceRootFolderName}/main/java/org/eclipse/che/examples`;
const tabTitle: string = 'HelloWorld.java';
let workspaceName: string;

// the suite expect user to be logged in
suite('Workspace creation via factory url', async () => {
    suite('Open factory URL', async () => {
        test(`Navigating to factory URL`, async () => {
            await browserTabsUtil.navigateTo(factoryUrl);
        });
    });

    suite('Wait workspace readyness', async () => {
        projectAndFileTests.waitWorkspaceReadiness(workspaceSampleName, workspaceRootFolderName, true, true);
    });

    suite('Check imported project', async () => {
        projectAndFileTests.openFile(fileFolderPath, tabTitle);

        projectAndFileTests.checkProjectBranchName('master');
    });

    suite ('Stopping and deleting the workspace', async () => {
        test('Stop and remove workspace', async () => {
            workspaceName = await workspaceNameHandler.getNameFromUrl();
            CheReporter.registerRunningWorkspace(workspaceName);

            await testWorkspaceUtils.cleanUpRunningWorkspace(workspaceName);
        });
    });

});
