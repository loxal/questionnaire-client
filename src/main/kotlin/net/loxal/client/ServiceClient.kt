/*
 * Copyright 2016 Alexander Orlov <alexander.orlov@loxal.net>. All rights reserved.
 */

package net.loxal.client

import net.loxal.client.dto.Poll

object ServiceClient {
    fun fetchQuiz(): List<Poll> {
        //        val quiz: Map<String, Map<String, String>> = HashMap()
        val p0 = Poll(question = "Question 0?", answerOptions = listOf("A", "B", "C"), correctAnswers = listOf(2))
        val p1 = Poll(question = "Question 1?", answerOptions = listOf("Aa", "Bb", "Cc"), correctAnswers = listOf(1))
        val p2 = Poll(question = "Question 2?", answerOptions = listOf("Aad", "Bbd", "Ccd"), correctAnswers = listOf(0))

        return listOf(p0, p2, p2)
    }
}