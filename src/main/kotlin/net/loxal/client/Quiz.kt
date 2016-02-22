/*
 * Copyright 2016 Alexander Orlov <alexander.orlov@loxal.net>. All rights reserved.
 */

package net.loxal.client

import org.w3c.dom.HTMLButtonElement
import org.w3c.dom.HTMLCollection
import org.w3c.dom.NodeList
import kotlin.browser.document
import kotlin.dom.onClick

object Quiz {
    private val answerOptions: NodeList = document.getElementsByName("answerOptions")
    private val answerOption: HTMLCollection = document.getElementsByClassName("answerOption")
    private val vote: HTMLButtonElement = document.getElementById("vote") as HTMLButtonElement

    init {
        vote.onClick { event ->
            console.info(answerOption.length)
            console.info(answerOption[0])
            console.info(answerOption[0]?.nodeValue)
            console.info(answerOption[0]?.textContent)

            console.warn(answerOptions.length)
            console.warn(answerOptions[0])
            console.warn(answerOptions[1]?.nodeValue)
            console.warn(answerOptions[2]?.textContent)
        }
    }
}