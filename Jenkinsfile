#!groovy

def tryStep(String message, Closure block, Closure tearDown = null) {
    try {
        block()
    }
    catch (Throwable t) {
        slackSend message: "${env.JOB_NAME}: ${message} failure ${env.BUILD_URL}", channel: '#ci-channel', color: 'danger'

        throw t
    }
    finally {
        if (tearDown) {
            tearDown()
        }
    }
}

String BRANCH = "${env.BRANCH_NAME}"

node {
    stage("Checkout") {
        def scmVars = checkout(scm)
        env.GIT_COMMIT = scmVars.GIT_COMMIT
    }

    stage("Get cached build") {
        if (env.JENKINS_URL == "https://ci.data.amsterdam.nl/") {
            docker.withRegistry('https://repo.data.amsterdam.nl','docker-registry') {
                def cachedImage = docker.image("ois/signalsfrontend:acceptance")
                cachedImage.pull()
            }
        }
    }

    stage("Lint") {
        String PROJECT = "sia-eslint-${env.GIT_COMMIT}"

        tryStep "lint start", {
            sh "docker-compose -p ${PROJECT} up --build --exit-code-from lint-container lint-container"
        }
        always {
            tryStep "lint stop", {
                sh "docker-compose -p ${PROJECT} down -v || true"
            }
        }
    }

    stage("Test") {
        String PROJECT = "sia-unittests-${env.GIT_COMMIT}"

        tryStep "unittests start", {
            sh "docker-compose -p ${PROJECT} up --build --exit-code-from unittest-container unittest-container"
        }
        always {
            tryStep "unittests stop", {
            sh "docker-compose -p ${PROJECT} down -v || true"
            }
        }
    }
}

if (BRANCH == "develop") {
    node {
        stage("Build and push acceptance image") {
            tryStep "build", {
                docker.withRegistry('https://repo.data.amsterdam.nl','docker-registry') {
                    def cachedImage = docker.image("ois/signalsfrontend:acceptance")
                    cachedImage.pull()

                    def image = docker.build("ois/signalsfrontend:${env.BUILD_NUMBER}",
                    "--shm-size 1G " +
                    "--build-arg NODE_ENV=acceptance " +
                    "--build-arg BUILD_ENV=acc " +
                    "--build-arg BUILD_NUMBER=${env.BUILD_NUMBER} " +
                    "--build-arg GIT_COMMIT=${env.GIT_COMMIT} " +
                    ".")

                    image.push()
                    image.push("acceptance")
                }
            }
        }
    }

    node {
        stage("Deploy to ACC") {
            tryStep "deployment", {
                build job: 'Subtask_Openstack_Playbook',
                parameters: [
                    [$class: 'StringParameterValue', name: 'INVENTORY', value: 'acceptance'],
                    [$class: 'StringParameterValue', name: 'PLAYBOOK', value: 'deploy-signals-frontend.yml'],
                ]
            }
        }
    }
}

if (BRANCH == "master") {
    node {
        stage("Build and Push Production image") {
            tryStep "build", {
                def image = docker.build("build.app.amsterdam.nl:5000/ois/signalsfrontend:${env.BUILD_NUMBER}",
                    "--shm-size 1G " +
                    "--build-arg NODE_ENV=production " +
                    "--build-arg BUILD_ENV=prod " +
                    "--build-arg BUILD_NUMBER=${env.BUILD_NUMBER} " +
                    "--build-arg GIT_COMMIT=${env.GIT_COMMIT} " +
                    ".")
                image.push("production")
                image.push("latest")
            }
        }
    }

    node {
        stage("Deploy to PROD") {
            tryStep "deployment", {
                build job: 'Subtask_Openstack_Playbook',
                parameters: [
                    [$class: 'StringParameterValue', name: 'INVENTORY', value: 'production'],
                    [$class: 'StringParameterValue', name: 'PLAYBOOK', value: 'deploy-signals-frontend.yml'],
                ]
            }
        }
    }
}
