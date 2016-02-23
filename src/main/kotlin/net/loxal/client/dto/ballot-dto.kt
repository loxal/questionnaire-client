/*
 * Copyright 2016 Alexander Orlov <alexander.orlov@loxal.net>. All rights reserved.
 */

package net.loxal.client.dto

data class Poll(
        var question: String = "",
        var answerOptions: List<String> = listOf(),
        var correctAnswers: List<Int>? = listOf(), // TODO make them invisible for non-admins
        /**
         * Provide a hint for the user & UI.
         */
        var multipleAnswers: Boolean = false
)

data class ReviewedVote(
        var pollId: String = "",
        var answers: List<Int> = listOf()
) {
    var user: String = "anonymous"
    var correct: Boolean? = false
}

data class Vote(
        var pollId: String = "",
        var answers: List<Int> = listOf()
) {
    var user: String = "anonymous"

    companion object {
        fun asUser(pollId: String, answers: List<Int>, user: String): Vote {
            val vote = Vote(pollId = pollId, answers = answers)
            vote.user = user

            return vote
        }
    }
}