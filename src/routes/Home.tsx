import React from 'react'
import Page from '../components/Page'
import Container from '../components/Container'
import Hero from '../components/Hero'
import QuickFacts from '../components/QuickFacts'
import Process from '../components/Process'
import FeaturedProjectsReplica from '../components/FeaturedProjectsReplica'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'

export default function Home() {
    return (
        <Page>
            <Container className="py-0">
                <Hero />
                <QuickFacts />
                <Process />
                <FeaturedProjectsReplica />
                <FAQ />
            </Container>
            <Footer />
        </Page>
    )
}
