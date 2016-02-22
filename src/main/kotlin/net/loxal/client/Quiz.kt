/*
 * Copyright 2016 Alexander Orlov <alexander.orlov@loxal.net>. All rights reserved.
 */

package net.loxal.client

import org.w3c.dom.HTMLButtonElement
import org.w3c.dom.HTMLCollection
import org.w3c.dom.HTMLInputElement
import kotlin.browser.document
import kotlin.dom.asElementList

object Quiz {
    @Suppress("UNCHECKED_CAST")
    private val answerOptions: List<HTMLInputElement> = document.getElementsByName("answerOptions").asElementList()  as List<HTMLInputElement>
    private val answerOption: HTMLCollection = document.getElementsByClassName("answerOption")
    private val vote: HTMLButtonElement = document.getElementById("vote") as HTMLButtonElement

    init {
        vote.onclick = { event ->
            println(getCheckedAnswerOption())
        }
    }

    private fun getCheckedAnswerOption() = answerOptions.asSequence().indexOfFirst { it.checked }

    fun test() {
        println("TESTED")
        vote.click()
    }
}