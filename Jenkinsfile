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
node('BS16 || BS17') {
    stage("Checkout") {
        def scmVars = checkout(scm)
        env.GIT_COMMIT = scmVars.GIT_COMMIT
        env.COMPOSE_DOCKER_CLI_BUILD = 1
    }

    if (BRANCH == "develop") {
        stage("Build and push the base image to speed up lint and unittest builds") {
            tryStep "build", {
                def image_name = "ois/signalsfrontend-base"
                docker.withRegistry("${DOCKER_REGISTRY_HOST}",'docker_registry_auth') {
                    def image = docker.build("${image_name}:${env.BUILD_NUMBER}",
                    "--shm-size 1G " +
                    "--target base " +
                    ".")
                    image.push()
                    image.push("acceptance")
                }
            }
        }
        stage("Build and push acceptance image") {
            tryStep "build", {
                docker.withRegistry("${DOCKER_REGISTRY_HOST}",'docker_registry_auth') {
                    def cachedImage = docker.image("ois/signalsfrontend:acceptance")

                    if (cachedImage) {
                        cachedImage.pull()
                    }

                    def image = docker.build("ois/signalsfrontend:${env.BUILD_NUMBER}",
                    "--shm-size 1G " +
                    "--build-arg BUILD_ENV=acc " +
                    "--build-arg BUILD_NUMBER=${env.BUILD_NUMBER} " +
                    "--build-arg GIT_COMMIT=${env.GIT_COMMIT} " +
                    ".")
                    image.push()
                    image.push("acceptance")
                }
            }
        }
        stage("Deploy to ACC") {
            tryStep "deployment", {
                build job: 'SIA_Signalen_Amsterdam/signals-amsterdam',
                parameters: [
                    string(name: 'GIT_BRANCH_NAME', value: 'develop')
                ]
            }
        }
    }
    if (BRANCH == "master") {
        stage("Build and Push Production image") {
            tryStep "build", {
                docker.withRegistry("${DOCKER_REGISTRY_HOST}",'docker_registry_auth') {
                    def cachedImage = docker.image("ois/signalsfrontend:production")

                    if (cachedImage) {
                        cachedImage.pull()
                    }

                    def image = docker.build("ois/signalsfrontend:${env.BUILD_NUMBER}",
                        "--shm-size 1G " +
                        "--build-arg BUILD_ENV=prod " +
                        "--build-arg BUILD_NUMBER=${env.BUILD_NUMBER} " +
                        "--build-arg GIT_COMMIT=${env.GIT_COMMIT} " +
                        ".")
                    image.push("production")
                    image.push("latest")
                }
            }
        }
        stage("Deploy to PROD") {
            tryStep "deployment", {
                build job: 'SIA_Signalen_Amsterdam/signals-amsterdam',
                parameters: [
                    string(name: 'GIT_BRANCH_NAME', value: 'master')
                ]
            }
        }
    }
}
