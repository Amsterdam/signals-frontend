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

    if (BRANCH == "develop" || BRANCH == "master") {
        stage("Build and push image") {
            tryStep "build", {
                docker.withRegistry("${DOCKER_REGISTRY_HOST}",'docker_registry_auth') {
                    def cachedImage = docker.image("ois/signalsfrontend:latest")

                    if (cachedImage) {
                        cachedImage.pull()
                    }

                    def image = docker.build("ois/signalsfrontend:${env.BUILD_NUMBER}",
                    "--shm-size 1G " +
                    "--build-arg BUILD_NUMBER=${env.BUILD_NUMBER} " +
                    "--build-arg GIT_COMMIT=${env.GIT_COMMIT} " +
                    ".")
                    image.push()
                    image.push("latest")
                }
            }
        }
    }

    if (BRANCH == "develop") {
        stage("Deploy to ACC") {
            tryStep "deployment", {
                build job: '/SIA_Signalen_Amsterdam/signals-amsterdam/develop'
            }
        }
    }

    if (BRANCH == "master") {
        stage("Deploy to PROD") {
            tryStep "deployment", {
                build job: '/SIA_Signalen_Amsterdam/signals-amsterdam/master'
            }
        }
    }
}
